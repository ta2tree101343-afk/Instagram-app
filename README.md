# Lumina App

Instagram風のSNS体験を再現したフロントエンドアプリケーションです。フィード、ストーリー、リール、プロフィール、メッセージ、投稿作成などの主要画面をReactで実装し、Redux Toolkitでアプリ状態を管理します。

## 1. プロジェクト概要

Lumina Appは、InstagramライクなUIと基本的なSNS操作を確認できるシングルページアプリケーションです。

現在はバックエンドを持たず、初期データはフロントエンド内のseedデータから生成します。ユーザー操作による投稿・いいね・保存・コメント・DMなどの状態は、ブラウザの`localStorage`またはホスト環境から注入される`window.storage`へ保存されます。

## 2. 使用技術

| 分類 | 技術 |
| --- | --- |
| UI | React 18 |
| 言語 | TypeScript |
| ビルドツール | Vite |
| 状態管理 | Redux Toolkit, React Redux |
| スタイリング | Tailwind CSS, CSS |
| アイコン | lucide-react |
| テスト | Vitest, Testing Library, jest-dom |
| 実行環境 | Node.js / npm |

## 3. 主な機能

- フィード投稿の表示
- 投稿へのいいね、保存、コメント追加
- 投稿作成モーダルからの新規投稿追加
- 投稿詳細モーダルの表示
- ストーリー一覧とストーリービューア
- Explore画面での投稿グリッド表示
- Reels画面での動画投稿表示
- Profile画面での投稿・保存済みタブ切り替え
- Messages画面でのDM表示、送信、疑似返信
- ダークモード切り替え
- `localStorage` / `window.storage`による状態永続化
- 画像読み込み失敗時のフォールバック表示

## 4. セットアップ手順（クイックスタート）

```bash
npm ci
npm run dev
```

開発サーバー起動後、ブラウザで以下にアクセスします。

```text
http://localhost:5173
```

本番ビルドを確認する場合は以下を実行します。

```bash
npm run build
npm run preview
```

## 5. 環境変数

現時点で必須の環境変数はありません。

状態保存は以下の優先順位で行います。

1. `window.storage`
2. `localStorage`

`window.storage`はホスト環境から注入される任意のストレージAPIです。未提供の場合は自動的に`localStorage`へフォールバックします。

## 6. API仕様 / エンドポイント

現時点で外部APIやバックエンドエンドポイントはありません。

アプリ内データは`src/shared/data/seeds.ts`で定義され、Redux stateとして管理されます。状態の永続化には`src/shared/lib/storage.ts`を使用します。

主なクライアント内データは以下です。

| データ | 概要 |
| --- | --- |
| `Post` | 投稿、画像/動画、キャプション、いいね、保存、コメント |
| `Story` | ストーリー、閲覧状態、背景画像または動画 |
| `Conversation` | DM会話、オンライン状態、未読数、メッセージ一覧 |
| `Profile` | 自分のプロフィール情報 |

## 7. ディレクトリ構成

```text
.
├── docs/
│   └── superpowers/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── store.ts
│   ├── features/
│   │   ├── explore/
│   │   ├── feed/
│   │   ├── messages/
│   │   ├── profile/
│   │   ├── reels/
│   │   └── stories/
│   ├── shared/
│   │   ├── components/
│   │   ├── data/
│   │   ├── lib/
│   │   ├── types/
│   │   └── utils/
│   ├── test/
│   ├── index.css
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

設計はFeature-Sliced Designを意識し、画面・状態管理を`features`、再利用部品や共通ロジックを`shared`、アプリ起点を`app`に配置しています。

## 8. DB・マイグレーション

現時点でDBは使用していません。マイグレーションもありません。

永続化はブラウザストレージのみで行います。保存キーは以下です。

```text
lumina-insta-state-v1
```

将来的にバックエンドやDBを追加する場合は、以下をREADMEに追記してください。

- 使用DB
- スキーマ管理方法
- マイグレーション実行コマンド
- ローカル開発用の初期データ投入手順

## 9. テスト

テストはVitestで実行します。

```bash
npm test
```

ウォッチモードで実行する場合:

```bash
npm run test:watch
```

ビルド時の型チェックと本番ビルド確認:

```bash
npm run build
```

現在の主なテスト対象:

- Redux reducerの振る舞い
- storageの読み込み・保存・異常系
- utility関数
- 型定義の基本整合性

## 10. セキュリティ

- APIキーやシークレットは使用していません。
- 機密情報をコードやseedデータにハードコードしないでください。
- 外部入力に相当する投稿本文、コメント、DM本文はReactの通常レンダリングで扱い、HTMLとして直接挿入しない方針です。
- 状態保存に失敗してもアプリが停止しないよう、storage層で例外を捕捉しています。
- 画像・動画の読み込み失敗時はフォールバック表示を行います。
- 依存関係を追加する場合は、ライセンス、メンテナンス状況、バンドルサイズ、既知の脆弱性を確認してください。

## 11. 主要パッケージとその選定理由

| パッケージ | 選定理由 |
| --- | --- |
| `react` / `react-dom` | コンポーネントベースでSPAを構築しやすく、エコシステムが豊富なため |
| `vite` | 開発サーバーが高速で、React + TypeScript構成を小さく始めやすいため |
| `typescript` | 型によって状態やpropsの不整合を早期に検出するため |
| `@reduxjs/toolkit` | Reduxの定型コードを減らし、slice単位で状態更新を整理できるため |
| `react-redux` | ReactコンポーネントからRedux storeへ型付きで接続するため |
| `tailwindcss` | ユーティリティクラスを使ってUIを素早く調整できるため |
| `lucide-react` | React向けの軽量なアイコンを一貫した見た目で利用できるため |
| `vitest` | Vite環境との相性が良く、高速にユニットテストを実行できるため |
| `@testing-library/react` | 実装詳細ではなく、ユーザー操作に近い観点でコンポーネントを検証しやすいため |
| `@testing-library/jest-dom` | DOMに対する読みやすいmatcherを追加し、テストの意図を明確にするため |
