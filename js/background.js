chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "lookupWord",
        title: "意味を見る",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    console.log("Tab Info:", tab);
    console.log("Context Menu Info:", info);
    if (!tab.id) {
        console.error("Tab ID is not available.");
        return;
    }
    if (info.menuItemId === "lookupWord") {
        console.log("Selected Word:", info.selectionText);
        const selectedWord = info.selectionText;
        chrome.storage.local.get(["feedback"], (data) => {
            const feedback = data.feedback || {};
            fetch(chrome.runtime.getURL("json/words.json"))
                .then((response) => response.json())
                .then((wordsData) => {
                    const closestWord = findClosestWord(selectedWord, wordsData, feedback);
                    const meaning = wordsData[closestWord]?.meaning || "意味が見つかりませんでした。";
                    console.log("Closest Word:", closestWord);
                    console.log("Meaning:", meaning);
                    if (chrome.scripting) {
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            files: ['js/content.js']
                        }, () => {
                            chrome.tabs.sendMessage(tab.id, { word: closestWord, meaning })
                                .then((response) => {
                                    console.log(response);
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        });
                    } else {
                        console.error("chrome.scripting is not available.");
                    }
                });
        });
    }
});

/**
 * Levenshtein距離を計算する関数
 * @param {string} a 比較する文字列1
 * @param {string} b 比較する文字列2
 * @returns {number} Levenshtein距離
 */
function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
        Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // 削除
                matrix[i][j - 1] + 1, // 挿入
                matrix[i - 1][j - 1] + cost // 置換
            );
        }
    }
    return matrix[a.length][b.length];
}

/**
 * 入力文字列とデータ内のキーを比較して、最も類似した文字列を見つける
 * @param {string} selectedWord 入力文字列
 * @param {Object} wordsData データオブジェクト
 * @param {Object} feedback フィードバックデータ
 * @returns {string} 最も類似した文字列
 */
function findClosestWord(selectedWord, wordsData, feedback) {
    const wordEntries = Object.entries(wordsData);
    let closest = "";
    let minDistance = Infinity;

    wordEntries.forEach(([word, data]) => {
        const distance = levenshteinDistance(selectedWord, word); // Levenshtein距離
        const feedbackWeight = feedback[word] || 1; // フィードバックの重みを考慮
        const adjustedDistance = distance / feedbackWeight;

        if (adjustedDistance < minDistance) {
            minDistance = adjustedDistance;
            closest = word;
        }
    });
    return closest;
}
