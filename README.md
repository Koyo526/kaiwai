# Kaiwai

Kaiwaiは、Webサイト上の単語の意味を表示し、フィードバックを収集するためのChrome拡張機能です。

##使用例

https://github.com/user-attachments/assets/117af268-bc3e-4b72-be9a-de9122422951



## 機能

- Webページ上の選択した単語の意味を表示
- ユーザーからのフィードバックを収集
- 類似した単語を検索

### img/
画像ファイルを格納するディレクトリです。

### js/
JavaScriptファイルを格納するディレクトリです。
- `background.js`: 拡張機能のバックグラウンドスクリプト
- `content.js`: Webページ上で実行されるコンテンツスクリプト

### json/
JSONデータファイルを格納するディレクトリです。
- `words.json`: 単語とその意味を格納したデータファイル
- `zozo-tech.json`: 技術用語とその意味を格納したデータファイル

### LICENSE
MITライセンスの情報を記載したファイルです。

### manifest.json
Chrome拡張機能の設定ファイルです。

### popup.html
拡張機能のポップアップページのHTMLファイルです。

## インストール方法

1. このリポジトリをクローンします。
 ```sh
    git clone https://github.com/yourusername/kaiwai.git
 ```
2. Chromeブラウザで `chrome://extensions/` にアクセスします。
3. 「デベロッパーモード」をオンにします。
4. 「パッケージ化されていない拡張機能を読み込む」をクリックし、クローンしたリポジトリの `kaiwai` ディレクトリを選択します。

## 使用方法

1. Webページ上で単語を選択し、右クリックメニューから「意味を見る」を選択します。
2. 選択した単語の意味が表示されます。
3. 表示された意味に対してフィードバックを提供できます。

## 貢献

バグ報告や機能提案は、Issueを通じて行ってください。プルリクエストも歓迎します。

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。
