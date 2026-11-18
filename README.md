# bfgen

8-dot/6-dot braille fonts generator

概要

これはユニコード点字フォントのSVGファイルとTTFファイルを出力する[Node.js](https://nodejs.org/ja)を使ったCLIアプリケーションです。
具体的には、yamlフォーマットで書かれたフォントのデータを元にsvgファイルを作成し、その内容を[svg2ttf](https://github.com/fontello/svg2ttf#readme)に渡して、TTF（TruType）ファイルを作成しています。なお、このとき生成先に同じ名前のファイルがあるときはベース名に(2),(3)という風に番号を付けた名前にします。

通常の点字フォントでは、点の無い場所がただの空白になりますが、これに形を与え、点の配置を視認しやすくしています。
この空白の点の形を、空白(empty)、空線(dash)、輪郭(outline)、空点(pin)と4種類用意しています。

点の形をSVGの書式で設定しているので、丸以外のものも作ることができます。応用として四角(square)、菱形(diamond)を用意しました。
これらのフォントは square.yaml, diamond.yaml などを使うと作れます。このときファイルでは空白の点は輪郭で描いています。

図形の形を微調整したいときは、config.yaml内の定数の値を変えます。
形自体を変えたいときは、src/shapes/shape.tsで定義されているshapeクラスを継承してメソッドを記述し、src/shapesフォルダに配置します。
詳しくは[SVG](https://triple-underscore.github.io/SVG11/index.html)を調べてください。特に[20.8 フォント記述](https://triple-underscore.github.io/SVG11/fonts.html#FontDescriptions)、[8.3 パスデータ](https://triple-underscore.github.io/SVG11/paths.html#PathData)が重要です。

## 使い方

bfgen -h で次のヘルプが出力されます。

```sh
Usage: bfgen [options]
Options:
  -V, --version                  output the version number
  -c, --config <configFile>      YAML-formated configuration file name (default: "config.yaml")
  -f, --fontfile <fontFileName>  font file basename (default: "brailleFont")
  -l, --list                     list configuration files in <config> directory
  -s, --shapes                   list available shapes
  -x, --svgxml                   output SVG XML file
  -h, --help                     output usage information
```

```sh
bfgen
```

引数無しのコマンド単独では、省略時の設定ファイル"config.yaml"、それが見つからなければプログラム内の規定値に従って、フォントを作成します（黒点は丸、白点は空線、点の数は８点）。

```sh
bfgen -c <configファイル名>
```

設定ファイル名を指定した場合、カレントディレクトリに指定のファイルがあればそれを使い、無ければプリセットの中からファイルを探して、そこに書かれている設定を元にフォントを作成します。

## インストール

ソースから実行する場合は、`npm install` 後に `npm run build` でビルドし、
`node dist/index.js -h` で起動できます。ソース変更後も `npm run build` を実行してください。

TypeScriptのソースは`src/`に配置し、ビルドしたJavaScript・型定義・ソースマップは、ディレクトリ構造を保って`dist/`に出力します。
設定ファイルの`config/`と翻訳ファイルの`locales/`は、プロジェクト直下に配置します。

[Node.js](https://nodejs.org/ja)をコンピュータにインストールしたあと、コマンドラインから次のコマンドを実行すると、bfgenコマンドを実行できるようになります。

```js
npm install -g --allow-git=all https://github.com/rosmarinus/bfgen3
```

または、yarnを導入済みであれば、

```js
yarn global add https://github.com/rosmarinus/bfgen3
```

## 更新履歴

## 用語等

六点点字（6-dot braille）
コンピュータで表示される点字は、左右4点ずつの最大8つの点まで表現できます。通常使う6点点字を表すときは、最下段の2点を空白のままにして、上の6点部分だけを使うことになります。
このプログラムは点の無い部分も別の印を表示しますが、六点点字として扱うときは最下段の2点は常に空白のままになります。
名前に"6"のあるプリセット設定ファイルで作成できます。設定ファイルで「sixDot: true」にすると有効になります。

シフト六点点字（shifted 6-dot braille）
通常の六点点字と違い、下の6点だけを使って表す6点点字を、通常のものと区別するために便宜上このように呼ぶことにします。
下に一段下げたこの六点点字は、漢点字と仮名点字を一緒に表示するときに必要です。
この六点点字においても、点の無い部分に印を表示するようにしたときは最上段の2点は常に空白のままになります。

八点点字（8-dot braille）
左右4点ずつの最大8つの点を使う点字です。日本では漢点字を表すために利用されます。

漢点字（kantenji braille）
川上泰一氏が考案した8点点字を使って漢字を表す点字です。これ以外の漢字を表す点字を示すものではありません。例えば、点字ワープロ等で普及している長谷川貞夫氏が考案した六点漢字を漢点字という言葉を使って呼ぶことはありません。漢点字は1マスから3マスを使い、一つの漢字を表します。最上段の二点で1漢字を表すマスの範囲を示し、下の六点で構成要素を表します。
名前に"-k"のあるプリセット設定ファイルで作成できます。設定ファイルで「kantenji: true」にすると有効になります。

ローテート漢点字（rotated kantenji braille）
漢点字の起点と終点を最下段に、六点部分を通常の六点点字と同じ位置に配置した点字です。
上の縁と下の縁をくっつけて、上方向に一段回転させた配置になっています。そのためこの変換をローテート（rotate）と呼ぶことにします。
このような漢点字は実在しませんが、通常のユニコード点字に含めることができる漢点字データとして便利なので、用意しておきます。
指で触れる場所でこのままの形で現れることはありません。

## ライセンス

このプログラムとプリセットの設定ファイル、そしてそれらによって作られたフォントファイルは、MITライセンスで公開します。

MITライセンス
