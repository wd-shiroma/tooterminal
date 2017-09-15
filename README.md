# Tooterminal

Tooterminalは、jQuery拡張プラグインjQueryTerminalEmulatorPluginを利用して作られたCiscoIOSライクな操作ができるマストドンクライアントです。

完全に俺得マストドンWebクライアントです。

CiscoIOSのコマンド感覚でマストドンしたかったので作りました。

## CiscoIOSとは

商用NW機器大手のCisco社製ルーター/スイッチ等で幅広く使われているファームウェアです

ネットワークエンジニアであれば、CCNAの資格取得でCiscoIOSに触れる機会が多いと思います。

強力なタブ補完機能とコマンド省略機能、ドキュメントが無くてもある程度コマンドを探して実行することができる利便性を備えたシステムだと思っています。

当クライアントは、CiscoIOSの操作性を最大限にリスペクトした、[shiroma@mstdn.jp](https://mstdn.jp/@shiroma)が趣味で作成しているcisco_emulator.jsをマストドンクライアントとして実装したものとなっています。

(一応注意書きしときますが、私はCisco社とは無縁の人間です)

# 使い方

## 基本的な操作感

[クライアントページ](http://wd-shiroma.github.io/tooterminal)にアクセスします。

ターミナルが起動したら「?」を押してみると大体どんなコマンドが打てるかわかります。

```
=== CLI画面風 マストドンクライアント "Tooterminal" ===

使い方は"help"コマンドまたは"?"キーを押してください。


Tooterminal# ?
Exec commands:
  show                          情報を表示します。
  instance                      インスタンスモードに移行します。
  delete                        インスタンスの削除をします。
  configure                     アプリケーションの設定を行います
  reload                        画面を再読み込みします。
  clear                         画面を消去します。
  write                         設定をローカルストレージに保存します。
  help                          ヘルプウインドウを表示します。
Tooterminal#
```

もしくはTabを2回押下でコマンド候補が表示されます。

```
Tooterminal# (ここでTab2回)
show    instance    delete    configure    reload    clear    write    help
```

少し文字を入力してから「?」を推すと候補が絞られます

```
Tooterminal# c?
Exec commands:
  configure                     アプリケーションの設定を行います
  clear                         画面を消去します。
```

メインのコマンド入力後、その下の階層のコマンドが出力します。

```
Tooterminal# show ?
Exec commands:
  instances                     全インスタンスの概要を表示します。
  running-configuration         設定されたコンフィグを確認します。
  startup-configuration         保存されたコンフィグを確認します。
  version                       クライアントのバージョンを表示します。
  clock                         現在時刻を表示します。
```

候補に<cr>が出てきたら、コマンドを実行することができます。

```
Tooterminal# show instances ?
Exec commands:
  statistics                    全インスタンスの概要を表示します。
  <instance_name>               指定インスタンスの詳細を表示します。
  <cr>

Tooterminal# show instances
name      | domain                      | scope | username
--------------------------------------------------------------------
jp        | mstdn.jp                    |  rwf  | @shiroma
nico      | friends.nico                |  rwf  | @shiroma
gunma     | gunmastodon.com             |  rwf  | @shiroma
--------------------------------------------------------------------
 登録件数: 3件
```

コマンドは省略して入力することも可能です。

```
Tooterminal# sh ins
name      | domain                      | scope | username
--------------------------------------------------------------------
jp        | mstdn.jp                    |  rwf  | @shiroma
nico      | friends.nico                |  rwf  | @shiroma
gunma     | gunmastodon.com             |  rwf  | @shiroma
--------------------------------------------------------------------
 登録件数: 3件
```

## アプリケーションの設定確認、保存、削除

設定はCiscoIOSに倣って、running-configとstartup-configに保存されています。

```
Tooterminal# sh run
{
    "application": {
        "name": "Tooterminal",
        "uris": "urn:ietf:wg:oauth:2.0:oob",
        "scopes": {
            "read": true,
            "write": true,
            "follow": true
        }
    },
    "terminal": {
        "length": 0
    }
}
Tooterminal#
Tooterminal#
Tooterminal# sh start
startup-config is not present
Tooterminal#
```

(sh runの結果がCisco実機と異なります。気分が向いたら合わせるかもしれないです)

running-configはページキャッシュ上のデータなので、startup-config(localStorage)に保存してやる必要があります。(上記はstartup-config未設定)

```
Tooterminal# wri mem
Building configuration...
[OK]
Tooterminal#
Tooterminal# sh start
{
    "application": {
        "name": "Tooterminal",
        "uris": "urn:ietf:wg:oauth:2.0:oob",
        "scopes": {
            "read": true,
            "write": true,
            "follow": true
        }
    },
    "terminal": {
        "length": 0
    }
}
```

設定を初期化する場合は、startup-configのデータを削除して、ページを再読み込みします。

```
Tooterminal# wri era
Erasing the localStorage will remove all configuration files! Continue? [confirm]
[OK]
Erase of nvram: complete
Tooterminal#
Tooterminal#
Tooterminal# reload
```

## アプリケーションの設定変更(コンフィギュレーションモード)

当クライアントに関する様々な設定はコンフィギュレーションモードに遷移して行います。

※現在未実装コンフィグが多数です。まともに動くのはapplication nameコマンドくらいです。

他のコマンドについては、そのうち実装する予定です。

```
Tooterminal# sh run
{
    "application": {
        "name": "Tooterminal",
        "uris": "urn:ietf:wg:oauth:2.0:oob",
        "scopes": {
            "read": true,
            "write": true,
            "follow": true
        }
    },
    "terminal": {
        "length": 0
    }
}
Tooterminal#
Tooterminal# conf t
Tooterminal(config)#
Tooterminal(config)# ?
Exec commands:
  application                   アプリケーション登録に関する設定を行います。
  terminal                      ターミナル表示に関する設定を行います。
  instances                     インスタンス登録の際の雛形設定を行います。
  no                            設定の削除を行います。
  exit                          コンフィギュレーションモードを終了します。
  end                           コンフィギュレーションモードを終了します。
Tooterminal(config)#
Tooterminal(config)# app name OriginalAppName
Tooterminal(config)#
Tooterminal(config)# exit
Tooterminal#
Tooterminal# sh run
{
    "application": {
        "name": "OriginalAppName",
        "uris": "urn:ietf:wg:oauth:2.0:oob",
        "scopes": {
            "read": true,
            "write": true,
            "follow": true
        }
    },
    "terminal": {
        "length": 0
    }
}
```

※一応日本語も使えますが、入力したコマンドがずれるバグがあります。マルチバイトに完全に対応できてないjQueryプラグインのせいです

※application scopesは設定変更できるようにしてありますが、出来るだけ変更しない方がいいと思います。

## インスタンスの登録/ログイン/操作 (インスタンスモード)

各インスタンスの登録はグローバルモードからinstanceコマンドを打ちます。

```
Tooterminal# ins jp
Input instance domain: mstdn.jp
New instance registed. enter 'login' and regist your access_token
@mstdn.jp# login
@mstdn.jp#
```

この時点ではインスタンスにアプリケーション登録をしただけの状態です。
アプリケーションの登録が正常に完了すると、各インスタンスの認証画面に遷移します。

![ユーザー認証(承認画面)](./img/regist_instance_1.png "ユーザー認証(承認画面)")

認証が成功したら、プロンプトが「(ユーザ名)@(ドメイン)#」に変わりインスタンスモードに遷移します。

登録したインスタンスを削除する場合はdeleteコマンドを実行します。

```
Tooterminal# del ins jp
Instance "jp" registration will delete! Continue? [confirm]
[OK]
Erase of instance: complete
Tooterminal#
```

※アプリケーションを再登録すると、別アプリケーションとして認識されてしまうため、アプリの再登録は極力控えるようにしましょう。

タイムラインのストリーミング再生↓

```
shiroma@mstdn.jp# ter mon

Streaming start.
[ ぐすくま ✅ @shiroma 2017-7-21 18:24:30.514 ] from Tooterminal
テスト

shiroma@mstdn.jp# ter no mon

Streaming closed.
shiroma@mstdn.jp#
```

トゥートする↓

```
shiroma@mstdn.jp# toot
```

![トゥート画面](./img/toot_window.png "トゥート画面")

「toot message...」にトゥート内容を記載します。

Toot!ボタンを押下するか、Ctrl+Enterでトゥートできます。

投稿枠はEscで非表示にできます。

** 画像の貼り付けは現在クリップボードの画像データからの貼り付けの未対応しています。 **

貼り付けた画像は対象をクリックすることで添付を取り消すことが出来ます。

![画像投稿](./img/toot_window.png "画像投稿")

## アイコンを表示する

Tooterminalはデフォルトでアイコンが非表示になっています。

有効にするためにはコンフィギュレーションモードで表示を有効にしてください。

```
Tooterminal# configure terminal
Tooterminal(config)# instances status avatar
Tooterminal(config)# exit
Tooterminal# show running-configuration
{
    "application": {
        "name": "Tooterminal",
        "uris": "urn:ietf:wg:oauth:2.0:oob",
        "scopes": {
            "read": true,
            "write": true,
            "follow": true
        }
    },
    "terminal": {
        "length": 0
    },
    "instances": {
        "monitor": "local",
        "status": {
            "avatar": {}  ★☆←avaterのコンフィグが入っていることを確認★☆
        }
    }
}
Tooterminal# write memory   ★☆←再読み込み後に設定が読み込まれるように、セーブしてください。★☆
Building configuration...
[OK]
Tooterminal#
```

## アクセス時に自動でインスタンスモードに入ってterminal monitorを打つ

URLの末尾にパラメータを設定することでインスタンスモードへの自動遷移＆terminal monitorコマンドの自動発行ができます。

`https://wd-shiroma.github.io/tooterminal?instance=インスタンス名&terminal=取得ストリーミング&notification=通知種別`

* インスタンス名
`Tooterminal# instance インスタンス名`で指定した名称
* 取得ストリーミング
home, local, publicを選択できます。
それ以外の文字列が指定された場合はrunning-configの設定値が適用されます。
* 通知種別
表示したい通知種別をカンマ区切りで複数選択できます。(初期値：notification=fav,rev,fol,men)
  * fav: お気に入り
  * reb: ブースト
  * fol: フォロー
  * men: リプライ
  * del: トゥート削除

## ショートカットキー

TooterminalではCtrl、Alt、Shiftを駆使した様々なショートカットが利用できます。

* Ctrl + D
現在のモードを終了します(exitと同じ)
* トゥートにマウスオーバーして Ctrl + クリック
トゥートをお気に入り登録します。
* トゥートにマウスオーバーして Alt + クリック
トゥートをブーストします。
* トゥートにマウスオーバーして Shift + クリック
トゥートに返信します。
* トゥートにマウスオーバーして ダブルクリック
トゥートのリプライツリーを表示します。
* 投稿画面で Ctrl + Enter
トゥートします。(Tootボタン押下と同様)
* 投稿画面で Esc
投稿ウインドウ、ヘルプウインドウを閉じます。
