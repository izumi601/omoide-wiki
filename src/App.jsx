import React, { useState, useMemo, useEffect } from "react";
import { Heart, Search, MapPin, Calendar, MessageCircle } from "lucide-react";

// サンプルデータ（フロント側の固定データ）
const sampleEvents = [
  { id: 1, name: "日本万国博覧会（大阪万博）", year: 1970, date: "1970-03-15", prefecture: "大阪府", category: "万博", description: "「人類の進歩と調和」をテーマに開催された国際博覧会" },
  { id: 2, name: "つくば科学万博", year: 1985, date: "1985-03-17", prefecture: "茨城県", category: "万博", description: "「人間・居住・環境と科学技術」をテーマとした国際科学技術博覧会" },
  { id: 3, name: "国際花と緑の博覧会（花の万博）", year: 1990, date: "1990-04-01", prefecture: "大阪府", category: "万博", description: "「自然と人間との共生」をテーマに開催" },
  { id: 4, name: "長野オリンピック", year: 1998, date: "1998-02-07", prefecture: "長野県", category: "スポーツ", description: "第18回冬季オリンピック" },
  { id: 5, name: "2002 FIFAワールドカップ", year: 2002, date: "2002-05-31", prefecture: "全国", category: "スポーツ", description: "日本と韓国で共同開催されたサッカーワールドカップ" },
  { id: 6, name: "愛知万博（愛・地球博）", year: 2005, date: "2005-03-25", prefecture: "愛知県", category: "万博", description: "「自然の叡智」をテーマとした国際博覧会" },
  { id: 7, name: "東京ディズニーランド開園", year: 1983, date: "1983-04-15", prefecture: "千葉県", category: "テーマパーク", description: "日本初のディズニーテーマパーク" },
  { id: 8, name: "ユニバーサル・スタジオ・ジャパン開業", year: 2001, date: "2001-03-31", prefecture: "大阪府", category: "テーマパーク", description: "映画をテーマにしたテーマパーク" },
  { id: 9, name: "さっぽろ雪まつり", year: 1980, date: "1980-02-05", prefecture: "北海道", category: "地域イベント", description: "大雪像が並ぶ冬の一大イベント" },
  { id: 10, name: "青森ねぶた祭", year: 1985, date: "1985-08-02", prefecture: "青森県", category: "地域イベント", description: "勇壮な大型ねぶたが街を練り歩く夏祭り" },
  { id: 11, name: "FUJI ROCK FESTIVAL（第1回）", year: 1997, date: "1997-07-26", prefecture: "山梨県", category: "音楽フェス", description: "富士天神山スキー場で開催された伝説の初回。翌年から新潟・苗場へ" },
  { id: 12, name: "SUMMER SONIC", year: 2000, date: "2000-08-05", prefecture: "東京都", category: "音楽フェス", description: "都市型ロックフェスティバルの先駆け。東京・大阪同時開催" },
  { id: 13, name: "ROCK IN JAPAN FESTIVAL", year: 2000, date: "2000-08-05", prefecture: "茨城県", category: "音楽フェス", description: "国営ひたち海浜公園で開催される日本最大級の夏フェス" },
  { id: 14, name: "ap bank fes", year: 2005, date: "2005-07-16", prefecture: "静岡県", category: "音楽フェス", description: "Mr.Children桜井和寿らが主催する環境音楽フェス" },
  { id: 15, name: "神戸ルミナリエ（第1回）", year: 1995, date: "1995-12-08", prefecture: "兵庫県", category: "イルミネーション", description: "阪神淡路大震災の鎮魂と復興を願って始まった光の芸術" },
  { id: 16, name: "東京ミレナリオ", year: 1999, date: "1999-12-24", prefecture: "東京都", category: "イルミネーション", description: "丸の内を彩った幻想的なイルミネーション。2005年まで開催" },
  { id: 17, name: "ハウステンボス 光の王国", year: 2001, date: "2001-11-03", prefecture: "長崎県", category: "イルミネーション", description: "全国に先駆けて大規模イルミネーションを展開したテーマパーク" },
  { id: 18, name: "なばなの里イルミネーション", year: 2004, date: "2004-10-23", prefecture: "三重県", category: "イルミネーション", description: "光のトンネルが話題を呼んだ冬の風物詩" },
];

// サンプルの公開思い出
const samplePublicMemories = {
  3: [
    { text: "コスモスの丘が本当に綺麗だった", timestamp: "2日前" },
    { text: "親に連れられて行った。暑かったなぁ", timestamp: "1週間前" },
    { text: "花のパレードで感動して泣いた", timestamp: "2週間前" },
    { text: "初デートで行った大切な思い出", timestamp: "3週間前" },
    { text: "焼きそば食べた記憶しかない笑", timestamp: "1ヶ月前" },
  ],
  7: [
    { text: "オープン初日に行った！並んだけど楽しかった", timestamp: "3日前" },
    { text: "シンデレラ城見て本当にディズニーが日本に来たんだって実感した", timestamp: "1週間前" },
    { text: "スペースマウンテンが怖すぎた", timestamp: "2週間前" },
  ],
  11: [
    { text: "台風で中止になったけど、あの混乱も含めて伝説", timestamp: "1日前" },
    { text: "レッチリ見れたのが一生の思い出", timestamp: "5日前" },
    { text: "泥だらけになりながらテント張った", timestamp: "1週間前" },
    { text: "翌年から苗場になって正解だったと思う笑", timestamp: "2週間前" },
  ],
  15: [
    { text: "震災の年、光に包まれて涙が止まらなかった", timestamp: "2日前" },
    { text: "毎年行ってる。神戸の希望の光", timestamp: "1週間前" },
    { text: "寒い中並んだけど、見る価値があった", timestamp: "3週間前" },
  ],
};

// 都道府県のリスト
const allPrefectures = ["北海道", "青森県", "茨城県", "千葉県", "東京都", "山梨県", "静岡県", "長野県", "愛知県", "三重県", "大阪府", "兵庫県", "長崎県", "全国"];

const App = () => {
  // ★ 初期値を sampleEvents で設定。データ取得部分は今回はローカルに留める
  const [events, setEvents] = useState(sampleEvents); 
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedPrefecture, setSelectedPrefecture] = useState("");
  const [myEvents, setMyEvents] = useState(new Set());
  const [myMemos, setMyMemos] = useState({}); // {eventId: {text, isPublic}}
  const [activeTab, setActiveTab] = useState("events");
  const [editingMemo, setEditingMemo] = useState(null);
  const [tempMemo, setTempMemo] = useState("");
  const [tempIsPublic, setTempIsPublic] = useState(false);
  const [expandedMemories, setExpandedMemories] = useState({});
  // ★ 新規イベント登録用の state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    year: "",
    date: "",
    prefecture: allPrefectures[0],
    category: "その他",
    description: "",
  });

  const [empathyCounts] = useState({
    1: 847, 2: 523, 3: 691, 4: 312, 5: 1205,
    6: 456, 7: 1834, 8: 892, 9: 234, 10: 178,
    11: 2341, 12: 1876, 13: 2104, 14: 987,
    15: 1523, 16: 876, 17: 654, 18: 1123,
  });
  
  // ★ データ取得ロジックは今回はコメントアウトまたは削除し、ローカルデータを使用します
  /*
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch("http://localhost:8000/events");
        if (!res.ok) return;              
        const data = await res.json();    
        setEvents(data);
      } catch (e) {
        console.error("イベント取得失敗:", e);
      }
    };
    loadEvents();
  }, []);  
  */

  const daysSince = (dateStr) => {
    if (!dateStr) return null;
    const eventDate = new Date(dateStr);
    const now = new Date();
    const diff = now - eventDate;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchSearch =
        !searchQuery ||
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.prefecture.includes(searchQuery) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchYear =
        !selectedYear || event.year.toString() === selectedYear;
      const matchPref =
        !selectedPrefecture || event.prefecture === selectedPrefecture;

      return matchSearch && matchYear && matchPref;
    }).sort((a, b) => b.year - a.year); // 年の降順でソート
  }, [searchQuery, selectedYear, selectedPrefecture, events]);

  const myEventsList = useMemo(() => {
    return events.filter((e) => myEvents.has(e.id));
  }, [myEvents, events]);

  const toggleMyEvent = (eventId) => {
    setMyEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
        setMyMemos((prevMemos) => {
          const newMemos = { ...prevMemos };
          delete newMemos[eventId];
          return newMemos;
        });
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const saveMemo = (eventId, text, isPublic) => {
    setMyMemos((prev) => ({
      ...prev,
      [eventId]: { text, isPublic },
    }));
    setEditingMemo(null);
    setTempMemo("");
    setTempIsPublic(false);
  };

  const startEditMemo = (eventId) => {
    setEditingMemo(eventId);
    const existing = myMemos[eventId];
    setTempMemo(existing?.text || "");
    setTempIsPublic(existing?.isPublic || false);
  };

  const toggleExpandMemories = (eventId) => {
    setExpandedMemories((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  // ★ 新規イベント登録の submit ハンドラ
  const handleAddEventSubmit = (e) => {
    e.preventDefault();

    // ★ バリデーション
    if (!newEvent.name || !newEvent.year || !newEvent.prefecture) {
      alert("イベント名、開催年、都道府県は必須です。");
      return;
    }

    // ★ 新しいIDの計算
    const nextId =
      events.length > 0
        ? Math.max(...events.map((ev) => ev.id)) + 1
        : 1;

    // ★ 新しいイベントオブジェクト
    const eventToAdd = {
      ...newEvent,
      id: nextId,
      year: Number(newEvent.year),
      category: newEvent.category || "その他",
    };

    // ★ フロント側のリストに追加
    setEvents((prev) => [...prev, eventToAdd]);

    // ★ フォームリセット
    setNewEvent({
      name: "",
      year: "",
      date: "",
      prefecture: allPrefectures[0],
      category: "その他",
      description: "",
    });
    setShowAddForm(false);
    alert(`「${eventToAdd.name}」をイベントリストに追加しました！`);

    // TODO: ここに fetch POST で Python/Supabase へのデータ永続化ロジックを追加する
    // fetch('http://localhost:8000/events', { method: 'POST', body: JSON.stringify(eventToAdd) }); 
  };
  
  const EventCard = ({ event, showJoinButton = true, showMemoSection = false }) => {
    const publicMemories = samplePublicMemories[event.id] || [];
    const displayMemories = expandedMemories[event.id]
      ? publicMemories
      : publicMemories.slice(0, 3);
    const hasMoreMemories = publicMemories.length > 3;

    return (
      <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 mb-4 shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              {event.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-amber-700 mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{event.year}年</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{event.prefecture}</span>
              </div>
            </div>
            {/* ★ event.date が存在する場合のみ daysSince を呼ぶように修正 */}
            {event.date && daysSince(event.date) !== null && (
              <p className="text-xs text-amber-600 italic mb-2">
                🕰️ あの日から {daysSince(event.date).toLocaleString()} 日
              </p>
            )}
            <p className="text-sm text-gray-700 leading-relaxed">
              {event.description}
            </p>
          </div>
          {showJoinButton && (
            <button
              onClick={() => toggleMyEvent(event.id)}
              className={`ml-4 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                myEvents.has(event.id)
                  ? "bg-amber-500 text-white shadow-md"
                  : "bg-amber-100 text-amber-800 hover:bg-amber-200"
              }`}
            >
              {myEvents.has(event.id) ? "✓ 記録済み" : "私も行った"}
            </button>
          )}
        </div>

        {/* みんなの思い出 */}
        {publicMemories.length > 0 && (
          <div className="mt-4 pt-4 border-t border-amber-100">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-semibold text-amber-900">
                みんなの思い出 ({publicMemories.length}件)
              </h4>
            </div>
            <div className="space-y-2">
              {displayMemories.map((memory, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3"
                >
                  <p className="text-sm text-gray-800">
                    💭 「{memory.text}」
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    {memory.timestamp}
                  </p>
                </div>
              ))}
            </div>
            {hasMoreMemories && !expandedMemories[event.id] && (
              <button
                onClick={() => toggleExpandMemories(event.id)}
                className="mt-2 text-sm text-amber-700 hover:text-amber-900 underline"
              >
                もっと見る ({publicMemories.length - 3}件)
              </button>
            )}
            {expandedMemories[event.id] && (
              <button
                onClick={() => toggleExpandMemories(event.id)}
                className="mt-2 text-sm text-amber-700 hover:text-amber-900 underline"
              >
                閉じる
              </button>
            )}
          </div>
        )}

        {/* メモセクション（マイイベントタブのみ） */}
        {showMemoSection && (
          <div className="mt-4 pt-4 border-t border-amber-100">
            {editingMemo === event.id ? (
              <div>
                <textarea
                  value={tempMemo}
                  onChange={(e) => setTempMemo(e.target.value)}
                  placeholder='あの日の思い出を一言... 「焼きそばの行列すごかった」「友達と泥だらけになった」など'
                  className="w-full p-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white bg-opacity-80 text-sm resize-none"
                  rows="3"
                />
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`public-${event.id}`}
                    checked={tempIsPublic}
                    onChange={(e) => setTempIsPublic(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <label
                    htmlFor={`public-${event.id}`}
                    className="text-sm text-amber-800"
                  >
                    この思い出をみんなに公開する 🌸
                  </label>
                </div>
                <p className="text-xs text-amber-600 italic mt-1 ml-6">
                  ※公開しても匿名で表示されます。あなたが誰かは分かりません
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => saveMemo(event.id, tempMemo, tempIsPublic)}
                    className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm hover:bg-amber-600 transition-colors"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setEditingMemo(null);
                      setTempMemo("");
                      setTempIsPublic(false);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {myMemos[event.id] ? (
                  <div className="mb-3">
                    <div className="bg-amber-50 bg-opacity-80 rounded-xl p-3 mb-2">
                      <p className="text-sm text-amber-900 italic">
                        💭 「{myMemos[event.id].text}」
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {myMemos[event.id].isPublic ? (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            ✓ 公開中
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            🔒 自分だけ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-amber-600 italic mb-2">
                    まだ思い出が書かれていません
                  </p>
                )}
                <button
                  onClick={() => startEditMemo(event.id)}
                  className="text-sm text-amber-700 hover:text-amber-900 underline"
                >
                  {myMemos[event.id] ? "✏️ 編集する" : "✏️ 思い出を書く"}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-amber-600 pt-3 border-t border-amber-100 mt-3">
          <Heart className="w-4 h-4" fill="currentColor" />
          <span>
            {(empathyCounts[event.id] || 0) +
              (myEvents.has(event.id) ? 1 : 0)}
            {" "}
            人がこの記憶を持っています
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="bg-white bg-opacity-70 backdrop-blur-md border-b border-amber-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            🎉 思い出ウィキ
          </h1>
          <p className="text-sm text-amber-700 italic">
            あなたの人生の足跡を、静かに照らす場所
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("events")}
            className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-200 ${
              activeTab === "events"
                ? "bg-amber-500 text-white shadow-lg"
                : "bg-white bg-opacity-60 text-amber-800 hover:bg-opacity-80"
            }`}
          >
            📋 イベントを探す
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-200 relative ${
              activeTab === "my"
                ? "bg-amber-500 text-white shadow-lg"
                : "bg-white bg-opacity-60 text-amber-800 hover:bg-opacity-80"
            }`}
          >
            👤 私の足跡
            {myEvents.size > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {myEvents.size}
              </span>
            )}
          </button>
        </div>

        {activeTab === "events" && (
          <>
            <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-5 h-5 text-amber-600" />
                <input
                  type="text"
                  placeholder="イベント名、場所で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white bg-opacity-80"
                />
              </div>

              {/* ★ フィルタリングと新規追加ボタンの配置を修正 */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-full border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white bg-opacity-80 text-sm"
                >
                  <option value="">すべての年代</option>
                  {[...new Set(events.map(e => e.year))].sort((a,b)=>b-a).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}年
                      </option>
                    ),
                  )}
                </select>
                <select
                  value={selectedPrefecture}
                  onChange={(e) => setSelectedPrefecture(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-full border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white bg-opacity-80 text-sm"
                >
                  <option value="">すべての地域</option>
                  {allPrefectures.map((pref) => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => setShowAddForm((prev) => !prev)}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors whitespace-nowrap"
                >
                  {showAddForm ? "フォームを閉じる" : "＋ イベントを追加する"}
                </button>
              </div>


              {/* ★ 追加フォーム本体 (ハンドラを修正) ★ */}
              {showAddForm && (
                <form
                  className="mt-4 pt-4 border-t border-amber-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm"
                  onSubmit={handleAddEventSubmit}
                >
                  <input
                    type="text"
                    required
                    placeholder="イベント名 *"
                    className="px-3 py-2 rounded-lg border border-amber-200 focus:outline-none focus:border-amber-400"
                    value={newEvent.name}
                    onChange={(e) =>
                      setNewEvent((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <input
                    type="number"
                    required
                    placeholder="開催年 *（例：1998）"
                    className="px-3 py-2 rounded-lg border border-amber-200 focus:outline-none focus:border-amber-400"
                    value={newEvent.year}
                    onChange={(e) =>
                      setNewEvent((prev) => ({ ...prev, year: e.target.value }))
                    }
                  />
                  <input
                    type="date"
                    placeholder="日付（任意）"
                    className="px-3 py-2 rounded-lg border border-amber-200 focus:outline-none focus:border-amber-400"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent((prev) => ({ ...prev, date: e.target.value }))
                    }
                  />
                  <select
                    required
                    className="px-3 py-2 rounded-lg border border-amber-200 focus:outline-none focus:border-amber-400"
                    value={newEvent.prefecture}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        prefecture: e.target.value,
                      }))
                    }
                  >
                    {allPrefectures.map((p) => (
                      <option key={p} value={p}>
                        都道府県 * ({p})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="カテゴリ（例：万博、音楽フェス）"
                    className="px-3 py-2 rounded-lg border border-amber-200 focus:outline-none focus:border-amber-400"
                    value={newEvent.category}
                    onChange={(e) =>
                      setNewEvent((prev) => ({ ...prev, category: e.target.value }))
                    }
                  />
                  <textarea
                    placeholder="ひとことでイベントの説明"
                    className="md:col-span-2 px-3 py-2 rounded-lg border border-amber-200 focus:outline-none focus:border-amber-400 resize-none"
                    rows={3}
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                  <div className="md:col-span-2 text-right mt-1">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
                    >
                      このイベントを登録する
                    </button>
                  </div>
                </form>
              )}
            </div>


            <div className="mb-4">
              <p className="text-sm text-amber-700 mb-4">
                {filteredEvents.length} 件のイベント
              </p>
              {filteredEvents.length === 0 ? (
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-8 text-center text-amber-700">
                  該当するイベントが見つかりませんでした
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              )}
            </div>
          </>
        )}

        {activeTab === "my" && (
          <div>
            {myEvents.size === 0 ? (
              <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg">
                <p className="text-lg text-amber-800 mb-4">
                  まだ足跡がありません
                </p>
                <p className="text-sm text-amber-700 mb-6">
                  「イベントを探す」から「私も行った」ボタンを押して、
                  <br />
                  あなたの記憶を記録してみましょう
                </p>
                <button
                  onClick={() => setActiveTab("events")}
                  className="px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                >
                  イベントを探しに行く
                </button>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 mb-6 shadow-lg">
                  <p className="text-lg text-amber-900 font-medium mb-2">
                    おかえりなさい
                  </p>
                  <p className="text-sm text-amber-800">
                    あなたの足跡は{" "}
                    <span className="text-2xl font-bold text-amber-600">
                      {myEvents.size}
                    </span>{" "}
                    個です
                  </p>
                  <p className="text-xs text-amber-700 mt-3 italic">
                    この記録はあなた以外には見えません。
                    <br />
                    公開を選んだ思い出だけが、みんなの温かい共感の輪に加わります。
                  </p>
                </div>

                {myEventsList.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    showJoinButton={false}
                    showMemoSection={true}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-sm text-amber-700 italic">
          思い出は、人生の宝物です
        </p>
      </div>
    </div>
  );
};

export default App;