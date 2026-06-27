# LiftLog

## アプリ概要

LiftLogは、筋トレの記録を管理するためのWebアプリです。  
ユーザー登録・ログイン後、自分のトレーニング記録を追加・一覧表示・詳細確認・編集・削除できます。

また、ダッシュボード上で今週の記録数、ストリーク、Personal Recordsを表示し、筋トレの継続状況や成長を確認できるようにしています。

---

## URL

- ポートフォリオURL：  
https://liftlog-portfolio.vercel.app/

- GitHub URL：  
https://github.com/yuki-n190/liftlog-portfolio.git

---

## 使用技術

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- AWS RDS
- bcryptjs
- jose
- Vercel

---

## 設計ドキュメント

- [ワークフロー図](docs/LiftLog_ワークフロー図.png)
- [ER図](docs/ER図.png)
- [ワイヤーフレーム](docs/LiftLog_ワイヤーフレーム.png)
---

## 機能一覧

### 認証機能

- ユーザー登録
- ログイン
- ログアウト
- 認証チェック

### 筋トレ記録機能

- 筋トレ記録の追加
- 筋トレ記録の一覧表示
- 筋トレ記録の詳細表示
- 筋トレ記録の編集
- 筋トレ記録の削除
- タグ・メモの登録
- 入力バリデーション

### ダッシュボード機能

- 今週の記録数表示
- ストリーク表示
- Personal Records表示
- 直近の記録表示

---

## 工夫した点

### 認証機能

JWTをhttpOnly Cookieに保存し、ログイン状態を管理しています。  
パスワードはbcryptjsでハッシュ化し、平文では保存しないようにしています。

### ユーザーごとのデータ管理

WorkoutLogにはuserIdを紐づけ、自分の記録だけを表示・編集・削除できるようにしています。  
API側でもuserIdを確認し、他ユーザーの記録を操作できないようにしています。

### 継続状況の可視化

Dashboardでは、今週の記録数、ストリーク、Personal Recordsを表示しています。  
筋トレ記録を保存するだけでなく、継続や成長が見えるようにしました。

---

## 今後の改善

- パスワードリセット機能
- タグ別・カテゴリ別の絞り込み表示
- グラフによる重量推移の可視化
- AIコーチ機能
- ECS + RDS構成への移行
