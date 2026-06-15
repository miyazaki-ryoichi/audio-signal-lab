# Audio Signal Lab

GitHub Pagesで公開できる、ブラウザ完結型の音響信号処理Webアプリ雛形です。

## Features

- 音声ファイルの読み込み
- 波形表示
- FFTスペクトル表示
- Low-pass / High-pass / Band-pass / Notch フィルタ
- Q、周波数、ゲインの調整
- 元音声と処理後音声の再生
- 処理後WAVの保存

## Run locally

このディレクトリを静的サーバーで開きます。

```bash
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080` を開いてください。

## Deploy to GitHub Pages

1. この `audio-signal-lab` ディレクトリの中身をGitHubリポジトリへpushします。
2. GitHubの `Settings` → `Pages` を開きます。
3. `Deploy from a branch` を選びます。
4. `main` ブランチと `/root` を選んで保存します。

数十秒後に `https://<user>.github.io/<repository>/` で公開されます。

## Notes

すべての処理はブラウザ内で実行されます。Python、DB、サーバーAPIは使っていません。
