chrome.runtime.onMessage.addListener((message) => {
    console.log("Message Received:", message);

    // 既存のポップアップを削除
    const existingPopup = document.getElementById("popup-result");
    if (existingPopup) {
        existingPopup.remove();
    }

    if (message.word && message.meaning) {

        // 閉じるボタンを追加
        // 後日実装
        // const closeButton = document.createElement("button");
        // closeButton.innerHTML = "&times;";
        // closeButton.style.position = "absolute";
        // closeButton.style.top = "5px";
        // closeButton.style.right = "5px";
        // closeButton.style.background = "none";
        // closeButton.style.border = "none";
        // closeButton.style.color = "black";
        // closeButton.style.fontSize = "20px";
        // closeButton.style.cursor = "pointer";
        // closeButton.onclick = () => {
        //     resultDiv.remove();
        //     clearCache();
        // };
        // resultDiv.appendChild(closeButton);

        console.log("Word:", message.word);
        console.log("Meaning:", message.meaning);

        const resultDiv = document.createElement("div");
        resultDiv.id = "popup-result"; // ポップアップにIDを設定
        resultDiv.style.position = "fixed";
        resultDiv.style.bottom = "20px"; // 余裕を持たせる
        resultDiv.style.right = "20px"; // 余裕を持たせる
        resultDiv.style.backgroundColor = "#f9f9f9"; // 柔らかい背景色
        resultDiv.style.border = "1px solid #ddd"; // ソフトなボーダー
        resultDiv.style.borderRadius = "8px"; // 角を丸める
        resultDiv.style.padding = "15px 20px"; // 内側のスペースを広めに
        resultDiv.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"; // シャドウを追加
        resultDiv.style.zIndex = 10000;
        resultDiv.style.color = "#333"; // 少し薄い文字色
        resultDiv.style.fontFamily = "Arial, sans-serif"; // 見やすいフォント
        resultDiv.style.fontSize = "14px";
        resultDiv.style.lineHeight = "1.6"; // 行間を調整

        resultDiv.innerHTML += `
            <p><strong>${message.word}</strong>: ${message.meaning}</p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 10px 0;"> <!-- 線を追加 -->
            <p>この回答は良いですか？</p>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button id="feedback-yes" style="
                    background-color: #4CAF50; 
                    color: white; 
                    border: none; 
                    padding: 8px 12px; 
                    border-radius: 5px; 
                    cursor: pointer; 
                    font-size: 14px;
                    transition: background-color 0.3s;">
                    はい
                </button>
                <button id="feedback-no" style="
                    background-color: #f44336; 
                    color: white; 
                    border: none; 
                    padding: 8px 12px; 
                    border-radius: 5px; 
                    cursor: pointer; 
                    font-size: 14px;
                    transition: background-color 0.3s;">
                    いいえ
                </button>
            </div>
        `;


        // ボタンのホバー効果をJavaScriptで追加（必要であれば）
        document.addEventListener("mouseover", (e) => {
            if (e.target.id === "feedback-yes") {
                e.target.style.backgroundColor = "#45a049";
            } else if (e.target.id === "feedback-no") {
                e.target.style.backgroundColor = "#e53935";
            }
        });
        document.addEventListener("mouseout", (e) => {
            if (e.target.id === "feedback-yes") {
                e.target.style.backgroundColor = "#4CAF50";
            } else if (e.target.id === "feedback-no") {
                e.target.style.backgroundColor = "#f44336";
            }
        });

        document.body.appendChild(resultDiv);

        const feedbackYesButton = document.getElementById("feedback-yes");
        const feedbackNoButton = document.getElementById("feedback-no");

        // 既存のイベントリスナーを削除
        feedbackYesButton.removeEventListener("click", handleFeedbackYes);
        feedbackNoButton.removeEventListener("click", handleFeedbackNo);

        // 新しいイベントリスナーを追加
        feedbackYesButton.addEventListener("click", handleFeedbackYes);
        feedbackNoButton.addEventListener("click", handleFeedbackNo);

        function handleFeedbackYes() {
            sendFeedback(message.word, true);
            resultDiv.remove();
            // clearCache();
        }

        function handleFeedbackNo() {
            sendFeedback(message.word, false);
            resultDiv.remove();
            // clearCache();
        }
    }
});

function sendFeedback(word, isPositive) {
    console.log("Sending Feedback:", word, isPositive);
    chrome.storage.local.get(["feedback"], (data) => {
        const feedback = data.feedback || {};
        feedback[word] = feedback[word] || 1;
        feedback[word] += isPositive ? 1 : -1;
        console.log("Feedback Data:", feedback);  
        chrome.storage.local.set({ feedback });
    });  
}

function clearCache() {
    console.log("Clearing cache...");
    caches.keys().then((names) => {
        for (let name of names) caches.delete(name);
    });
}
