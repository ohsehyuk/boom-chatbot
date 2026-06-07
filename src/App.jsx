import { useEffect, useRef, useState } from "react";

function App() {

  const getLevelColor = (level) => {
  if (level?.includes("붐")) {
    return "text-red-400";
  }

  if (level?.includes("보통")) {
    return "text-yellow-400";
  }

  return "text-green-400";
};

  const [screen, setScreen] = useState("splash");

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
  age: "",
  gender: "",
  companion: "",
  purpose: "",
  mood: "",
});

const [places, setPlaces] = useState([]);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "어디 놀러갈 예정이야? 시간대나 분위기까지 알려주면 더 정확하게 추천해줄게 👀",
    },
  ]);

  const messagesEndRef = useRef(null);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  //먼진몰라도일단추가
useEffect(() => {
  const loadPlaces = async () => {
    try {
      const res = await fetch(
        "https://boom-ai-worker.sh031300.workers.dev/places"
      );

      const data = await res.json();

      setPlaces(data);
    } catch (error) {
      console.error(error);
    }
  };

  loadPlaces();
}, []);

  // AI 타이핑 효과
  const typeMessage = async (text) => {
    let currentText = "";

    const aiMessage = {
      role: "ai",
      text: "",
    };

    setMessages((prev) => [...prev, aiMessage]);

    for (let i = 0; i < text.length; i++) {
      currentText += text[i];

      await new Promise((resolve) =>
        setTimeout(resolve, 12)
      );

      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: "ai",
          text: currentText,
        };

        return updated;
      });
    }
  };

  // 메시지 전송
  const sendMessage = async (customMessage = null) => {
    const messageToSend = customMessage || input;

if (!messageToSend.trim()) return;

    const userMessage = {
  role: "user",
  text: messageToSend,
};

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = messageToSend;

    setInput("");

    setLoading(true);

    try {
      const response = await fetch("https://boom-ai-worker.sh031300.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  message: currentInput,
  profile: profile,
  history: messages,
}),
      });

      const data = await response.json();

      setLoading(false);

      await typeMessage(data.reply);

    } catch (error) {
      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "AI 연결 중 문제가 발생했어 😢",
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center overflow-hidden">

      {/* 모바일 프레임 */}
      <div className="w-[390px] h-[844px] bg-black rounded-[40px] border border-white/10 overflow-hidden relative shadow-2xl">

        {/* Glow */}
        <div className="absolute w-[300px] h-[300px] bg-orange-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />

        <div className="absolute w-[250px] h-[250px] bg-pink-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

        {/* SPLASH */}
        {screen === "splash" && (
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-white">

            <h1 className="text-6xl font-black tracking-tight">
              💥BOOM!
            </h1>

            <p className="mt-6 text-center text-white/70 leading-relaxed text-lg">
              내가 지금 가려는 곳,<br />
              얼마나 BOOM빌까?💥
            </p>

            <button
              onClick={() => setScreen("onboarding")}
              className="mt-16 w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold text-lg shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all duration-300"
            >
              시작하기
            </button>

          </div>
        )}

        {/* ONBOARDING */}
        {screen === "onboarding" && (
  <div className="relative z-10 flex flex-col h-full px-6 pt-20 text-white overflow-y-auto">

    <h2 className="text-3xl font-bold">
      조금 더 알려줄래? 👀
    </h2>

    <p className="mt-2 text-white/60">
      더 정확한 추천을 해줄 수 있어
    </p>

    {/* 연령대 */}
    <div className="mt-8">
      <p className="mb-3 text-white/80">
        연령대
      </p>

      <div className="flex flex-wrap gap-2">
        {["10대", "20대", "30대", "40대+"].map((item) => (
          <button
            key={item}
            onClick={() =>
              setProfile((prev) => ({
                ...prev,
                age: item,
              }))
            }
            className={`px-4 py-2 rounded-full ${
  profile.age === item
    ? "bg-orange-500 text-white"
    : "bg-white/10"
}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>

    {/* 성별 */}
<div className="mt-8">
  <p className="mb-3 text-white/80">
    성별
  </p>

  <div className="flex flex-wrap gap-2">
    {["남성", "여성", "상관없음"].map((item) => (
      <button
        key={item}
        onClick={() =>
          setProfile((prev) => ({
            ...prev,
            gender: item,
          }))
        }
        className={`px-4 py-2 rounded-full ${
  profile.gender === item
    ? "bg-orange-500 text-white"
    : "bg-white/10"
}`}
      >
        {item}
      </button>
    ))}
  </div>
</div>

    {/* 동행 */}
    <div className="mt-8">
      <p className="mb-3 text-white/80">
        누구와 가?
      </p>

      <div className="flex flex-wrap gap-2">
        {["혼자", "친구", "연인", "가족"].map((item) => (
          <button
            key={item}
            onClick={() =>
              setProfile((prev) => ({
                ...prev,
                companion: item,
              }))
            }
            className={`px-4 py-2 rounded-full ${
  profile.companion === item
    ? "bg-orange-500 text-white"
    : "bg-white/10"
}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>

    {/* 목적 */}
    <div className="mt-8">
      <p className="mb-3 text-white/80">
        오늘 뭐 하고 싶어?
      </p>

      <div className="flex flex-wrap gap-2">
        {[
          "카페",
          "맛집",
          "데이트",
          "쇼핑",
          "산책",
          "전시",
        ].map((item) => (
          <button
            key={item}
            onClick={() =>
              setProfile((prev) => ({
                ...prev,
                purpose: item,
              }))
            }
            className={`px-4 py-2 rounded-full ${
  profile.purpose === item
    ? "bg-orange-500 text-white"
    : "bg-white/10"
}`}


          >
            {item}
          </button>
        ))}
      </div>
    </div>

    {/* 분위기 */}
    <div className="mt-8">
      <p className="mb-3 text-white/80">
        어느 정도 붐비는 게 좋아?
      </p>

      <div className="flex flex-wrap gap-2">
        {[
          "북적북적",
          "적당히 활기",
          "조용함",
        ].map((item) => (
          <button
            key={item}
            onClick={() =>
              setProfile((prev) => ({
                ...prev,
                mood: item,
              }))
            }
            className={`px-4 py-2 rounded-full ${
  profile.mood === item
    ? "bg-orange-500 text-white"
    : "bg-white/10"
}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>

    <button
      onClick={() => setScreen("home")}
      className="mt-10 mb-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 font-semibold"
    >
      💥BOOM! 시작하기
    </button>

  </div>
)}

        {/* HOME */}
        {screen === "home" && (
          <div className="relative z-10 flex flex-col h-full text-white">

            {/* 상단 */}
            <div className="px-6 pt-16">

              <h1 className="text-3xl font-bold">
                지금 서울 분위기 🔥
              </h1>

              <p className="mt-2 text-white/60">
                실시간 도시 흐름 기반 추천
              </p>

<button
  onClick={() => setScreen("onboarding")}
  className="mt-4 text-sm text-orange-300"
>
  프로필 다시 설정 →
</button>

              {/* 프로필 */}
              <div className="mt-4 flex gap-2 flex-wrap">

                <div className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/80">
                  {profile.age}
                </div>

                <div className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/80">
                  {profile.gender}
                </div>

                <div className="px-3 py-1 rounded-full bg-orange-500/20 text-sm text-orange-300">
                  {profile.companion}
                </div>

              </div>

            </div>

            {/* 카드 영역 */}
            <div
  className="
    mt-10
    px-6
    flex
    flex-col
    gap-4
    overflow-y-auto
    flex-1
  "
>

  {places.length === 0 && (
    <div className="text-white/50 text-center">
      서울 데이터 불러오는 중...
    </div>
  )}

  {places.map((place, index) => (
    <div
  key={index}
  onClick={() => {
    setScreen("chat");

    setTimeout(() => {
      sendMessage(
        `${place.name} 지금 가도 괜찮을까?`
      );
    }, 300);
  }}
  className="
bg-white/5
border
border-white/10
rounded-3xl
p-5
backdrop-blur-xl
cursor-pointer
hover:bg-white/10
transition-all
"
>

      <div className="flex items-center justify-between">

  <h2 className="text-xl font-semibold">
    {place.name}
  </h2>

  <div className="text-right">

    <div className="text-orange-400 font-bold">
      {place.boomScore}
    </div>

    <div className="text-xs text-white/50">
      BOOM💥
    </div>

  </div>

</div>

      <p className="mt-2 text-sm text-white/60 line-clamp-2">
  {place.message}
</p>

    </div>
  ))}

</div>

            {/* 하단 버튼 */}
            <div className="p-6 shrink-0">

              <button
                onClick={() => setScreen("chat")}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 font-semibold text-lg"
              >
                AI에게 물어보기
              </button>

            </div>

          </div>
        )}

        {/* CHAT */}
        {screen === "chat" && (
          <div className="relative z-10 flex flex-col h-full text-white">

            {/* 상단 */}
            <div className="px-6 pt-16 pb-6 border-b border-white/10">

              <button
                onClick={() => setScreen("home")}
                className="text-white/60 mb-6"
              >
                ← 돌아가기
              </button>

              <h1 className="text-2xl font-bold">
                💥BOOM! AI
              </h1>

              <p className="mt-2 text-white/60">
                실시간 도시 흐름 기반 추천
              </p>

            </div>

            {/* 채팅 영역 */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">

            <div className="flex gap-2 overflow-x-auto pb-4">
  {[
    "오늘 어디가 제일 핫해?",
    "친구랑 가기 좋은 곳 추천",
    "데이트 코스 추천",
    "혼자 가기 좋은 곳 추천",
  ].map((question) => (
    <button
      key={question}
      onClick={() => {
  sendMessage(question);
}}
      className="px-3 py-2 rounded-full bg-white/10 text-sm whitespace-nowrap"
    >
      {question}
    </button>
  ))}
</div>

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[85%] p-5 leading-relaxed rounded-3xl border ${
                    message.role === "user"
                      ? "ml-auto rounded-tr-md bg-gradient-to-r from-orange-500 to-pink-500 border-transparent"
                      : "rounded-tl-md bg-white/5 border-white/10"
                  }`}
                >
                  {message.text}
                </div>
              ))}

              {/* 로딩 */}
              {loading && (
                <div className="max-w-[80%] p-5 rounded-3xl rounded-tl-md bg-white/5 border border-white/10 text-white/60">
                  서울 도시 흐름 분석 중... 👀
                </div>
              )}

              {/* 자동 스크롤 기준점 */}
              <div ref={messagesEndRef} />

            </div>

            {/* 입력창 */}
            <div className="p-4 border-t border-white/10">

              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">

                <input
                  id="chat"
                  name="chat"
                  type="text"
                  placeholder="어디 가볼까?"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  className="bg-transparent flex-1 outline-none text-white placeholder:text-white/30"
                />

                <button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 rounded-xl text-sm font-medium"
                >
                  전송
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;