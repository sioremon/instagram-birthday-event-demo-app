import Konva from 'konva';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Layer, Stage, Text } from 'react-konva';
import { useWindowSize } from 'react-use';
import useImage from 'use-image';
import './App.css';
import card from './assets/latest.jpg';
import { Footer } from './components/Footer';
import { Head } from './components/Head';

function App() {
  const [baseSize, setBaseSize] = useState(1280);
  const LINE_LENGTH = 19;

  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [stageSize, setStageSize] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const [messagePosition, setMessagePosition] = useState({ x: stageSize, y: stageSize });
  const [namePosition, setNamePosition] = useState({ x: stageSize, y: stageSize });
  const stageRef = useRef<Konva.Stage>(null);
  const [isValidLineLength, setIsValidLineLength] = useState(true);
  const [messageFontSize, setMessageFontSize] = useState(60);
  const [nameFontSize, setNameFontSize] = useState(40);
  const stageCssClass = `items-center max-w-[${baseSize}] mb-9`;

  console.log('re rendered');

  // カードの画像を読み込む関数
  const [img] = useImage(card);
  useEffect(() => {
    if (img) {
      setBaseSize(img.width);
    }
  }, [img]);

  const Card = () => {
    return <Image image={img} />;
  };

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // メッセージの変更系の関数
  // 入力されたテキストを読み取り, 1行あたりの文字数をカウントし, 18文字以上の行があればfalseを返す
  const isValidTextLength = useCallback(
    (text: string) => {
      console.log('isValidTextLength');
      // 1行あたりの文字数をカウントする
      const lines = text.split('\n');
      // スプレッド演算子で配列を展開し, 1行あたりの文字数をカウントする
      const lineLengths = lines.map(line => line.length);
      return lineLengths.every(lineLength => lineLength <= LINE_LENGTH);
    },
    [LINE_LENGTH]
  );

  // messageの状態管理をuseEffectで行う
  useEffect(() => {
    console.log('useEffect message');
    if (!isValidTextLength(message)) {
      setIsValidLineLength(false);
    } else {
      setIsValidLineLength(true);
    }
  }, [message, isValidTextLength]);

  // メッセージの改行の数をカウントする関数
  // useCallbackを使ってキャッシュする
  // const countNameLineBreaks = useCallback(() => {
  //   console.log('countNameLineBreaks')
  //   return name.split('\n').length - 1;
  // }, [name])

  // 改行の数をカウントする関数
  const countLineBreaks = useCallback((text: string) => {
    console.log('countLineBreaks');
    console.log(text.split('\n').length - 1);
    return text.split('\n').length - 1;
  }, []);

  const lineLengthAlert = useCallback(() => {
    console.log('lineLengthAlert');
    if (!isValidLineLength) {
      return (
        <div
          className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">1行が長すぎます！</span> 1行は{LINE_LENGTH}文字以内にしてください
          </div>
        </div>
      );
    }
  }, [isValidLineLength, LINE_LENGTH]);

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // メッセージカードをダウンロードする関数
  const download = useCallback(() => {
    if (!stageRef.current) {
      return;
    }
    const link = document.createElement('a');
    link.download = `${name}.png`;
    // 原寸大でダウンロードする

    link.href = stageRef.current.toDataURL({ pixelRatio: Math.pow(stageRef.current.width() / baseSize, -1) });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [stageRef, baseSize, name]);

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // ドラッグ操作

  // ドラッグ操作の境界を画像内に制限する関数
  const messageDragBound = useCallback(
    (pos: Konva.Vector2d): Konva.Vector2d => {
      console.log('messageDragBound');
      // posが0以上かつ画像を越えないならposを返す
      if (!stageRef.current) {
        return pos;
      }
      // console.log(stageRef.current.width(), stageRef.current.height());
      const x = Math.max(0, Math.min(stageRef.current.width() - messageFontSize, pos.x));
      const y = Math.max(0, Math.min(stageRef.current.height() - messageFontSize, pos.y));
      console.log(x, y);
      return { x, y };
    },
    [messageFontSize, stageRef]
  );

  // ドラッグ操作の境界を画像内に制限する関数
  const nameDragBound = useCallback(
    (pos: Konva.Vector2d): Konva.Vector2d => {
      console.log('nameDragBound');
      // posが0以上かつ画像を越えないならposを返す
      if (!stageRef.current) {
        return pos;
      }
      // console.log(stageRef.current.width(), stageRef.current.height());
      const x = Math.max(0, Math.min(stageRef.current.width() - nameFontSize, pos.x));
      const y = Math.max(0, Math.min(stageRef.current.height() - nameFontSize, pos.y));
      console.log(x, y);
      return { x, y };
    },
    [nameFontSize, stageRef]
  );

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // widthが変更されたときにstageSizeを更新する
  useEffect(() => {
    console.log('useEffect divRef');
    if (divRef.current) {
      setStageSize(divRef.current.offsetWidth);
    }
  }, [width]);

  const scale = stageSize / baseSize;

  return (
    <>
      <div className="items-center p-4">
        <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-6">
          中山莉子生誕企画 メッセージカード
        </h1>
        <Head lineLength={LINE_LENGTH} />
        <div className="mb-11">
          <button
            onClick={download}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            <span>画像をダウンロード</span>
          </button>
        </div>
        <div ref={divRef} className={stageCssClass}>
          <Stage width={stageSize} height={stageSize} ref={stageRef} scaleX={scale} scaleY={scale}>
            <Layer>
              {Card()}
              <Text
                text={message}
                fontSize={messageFontSize}
                fill="#21A0DB"
                fontFamily="uzura"
                x={messagePosition.x}
                y={messagePosition.y}
                width={message.length * messageFontSize}
                height={messageFontSize * (countLineBreaks(message) + 2.5)}
                draggable={true}
                dragBoundFunc={messageDragBound}
                onDragMove={e => {
                  setMessagePosition({
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
              />
              <Text
                text={name}
                fontSize={nameFontSize}
                fill="#21A0DB"
                fontFamily="uzura"
                x={namePosition.x}
                y={namePosition.y}
                width={name.length * nameFontSize}
                height={nameFontSize * (countLineBreaks(name) + 2.5)}
                draggable={true}
                dragBoundFunc={nameDragBound}
                onDragMove={e => {
                  setNamePosition({
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
              />
            </Layer>
          </Stage>
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block mb-4 text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl font-medium text-gray-900 dark:text-white"
        >
          名前を入力
        </label>
        <textarea
          onChange={e => setName(e.target.value)}
          maxLength={45}
          id="nameTextArea"
          rows={1}
          className="
          mb-9
          block
          p-2.5
          w-full
          text-base
          sm:text-sm
          md:text-xl
          lg:text-2xl
          xl:text-3xl
          text-gray-900
          bg-transparent
          rounded-lg
          border
          border-gray-300
          focus:ring-blue-500
          focus:border-blue-500
          dark:bg-gray-700
          dark:border-gray-600
          dark:placeholder-gray-400
          dark:text-white
          dark:focus:ring-blue-500
          dark:focus:border-blue-500
        "
          placeholder="名前を入力"
        ></textarea>

        <label
          htmlFor="message"
          className="block mb-4 text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl font-medium text-gray-900 dark:text-white"
        >
          文字サイズ
        </label>
        <form className="max-w-sm mx-auto">
          <select
            onChange={e => setNameFontSize(Number(e.target.value))}
            value={nameFontSize}
            className="
            mb-24
            bg-gray-50
            border
            border-gray-300
            text-gray-900
            text-base
            sm:text-sm
            md:text-xl
            lg:text-2xl
            xl:text-3xl
            rounded-lg
            focus:ring-blue-500
            focus:border-blue-500
            block
            w-full
            p-2.5
            dark:bg-gray-700
            dark:border-gray-600
            dark:placeholder-gray-400
            dark:text-white
            dark:focus:ring-blue-500
            dark:focus:border-blue-500
          "
          >
            <option value="20">20px</option>
            <option value="25">25px</option>
            <option value="30">30px</option>
            <option value="35">35px</option>
            <option value="40">40px</option>
            <option value="45">45px</option>
            <option value="50">50px</option>
            <option value="55">55px</option>
            <option value="60">60px</option>
          </select>
        </form>
        <div>
          <label
            htmlFor="message"
            className="block mb-6 text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl font-medium text-gray-900 dark:text-white"
          >
            メッセージを入力
          </label>

          <textarea
            onChange={e => setMessage(e.target.value)}
            maxLength={110}
            id="messageTextArea"
            rows={8}
            className="
              mb-9
              block
              p-2.5
              w-full
              text-base
              sm:text-sm
              md:text-xl
              lg:text-2xl
              xl:text-3xl
              text-gray-900
              bg-transparent
              rounded-lg
              border
              border-gray-300
              focus:ring-blue-500
              focus:border-blue-500
              dark:bg-gray-700
              dark:border-gray-600
              dark:placeholder-gray-400
              dark:text-white
              dark:focus:ring-blue-500
              dark:focus:border-blue-500
            "
            placeholder="メッセージを入力"
          ></textarea>

          {!isValidLineLength && lineLengthAlert()}

          <label
            htmlFor="message"
            className="block mb-6 text-base sm:text-sm md:text-xl lg:text-2xl xl:text-3xl font-medium text-gray-900 dark:text-white"
          >
            文字サイズ
          </label>
          <form className="max-w-sm mx-auto">
            <select
              onChange={e => setMessageFontSize(Number(e.target.value))}
              value={messageFontSize}
              className="
                mb-24
                bg-gray-50
                border
                border-gray-300
                text-gray-900
                text-base
                sm:text-sm
                md:text-xl
                lg:text-2xl
                xl:text-3xl
                rounded-lg
                focus:ring-blue-500
                focus:border-blue-500
                block
                w-full
                p-2.5
                dark:bg-gray-700
                dark:border-gray-600
                dark:placeholder-gray-400
                dark:text-white
                dark:focus:ring-blue-500
                dark:focus:border-blue-500
              "
            >
              <option value="40">40px</option>
              <option value="45">45px</option>
              <option value="50">50px</option>
              <option value="55">55px</option>
              <option value="60">60px</option>
              <option value="65">65px</option>
              <option value="70">70px</option>
              <option value="75">75px</option>
              <option value="80">80px</option>
              <option value="85">85px</option>
              <option value="90">90px</option>
              <option value="95">95px</option>
              <option value="100">100px</option>
              <option value="105">105px</option>
              <option value="110">110px</option>
              <option value="115">115px</option>
              <option value="120">120px</option>
            </select>
          </form>
        </div>

        {/* <button onClick={download} className='"bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 border border-blue-500 rounded-full dark:text-white"'>ダウンロード!</button> */}
      </div>
      <Footer />
    </>
  );
}

export default App;
