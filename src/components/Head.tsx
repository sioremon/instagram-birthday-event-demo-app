interface Props {
  lineLength: number;
}

export const Head: React.FC<Props> = ({ lineLength }) => (
  <>
    <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-6">中山莉子生誕企画 メッセージカード</h1>
    <div className="mb-16">
      <p className="text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl  mb-6 text-red-500">
        端末によっては文字が期待通りに表示されない場合があります.(修正中)
      </p>
      <p className="text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl mb-6">
        推奨ブラウザはChromeです. Safari上では期待通りに動作しない可能性があります.{' '}
      </p>
      <p className="text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl mb-6">
        メッセージは100文字まで入力できます
      </p>
      <p className="text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl mb-6">
        1行{lineLength}文字を目安に改行してください(40pxの場合)
      </p>
      <p className="text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl mb-6">絵文字は非推奨です. </p>
      <p className="text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl mb-6">
        表示された文字は画像の中で動かすことができます
      </p>
      <p className="text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl mb-6">
        メッセージを書き終わったらページ下部のダウンロードボタンを押してダウンロードしてください
      </p>
    </div>
  </>
);
