"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
  category: string;
  difficulty: string;
};

type Club = {
  id: number;
  name: string;
  country: string | null;
};

type Player = {
  id: number;
  name: string;
  nationality: string | null;
  position: string | null;
};

type PlayerClub = {
  player_id: number;
  club_id: number;
};
type CareerMapQuestion = {
  id: number;
  player_id: number;
  difficulty: string;
  hint_1: string;
  hint_2: string;
  hint_3: string;
};

export default function Home() {
  const supabase = createClient();

  // state'ler burada devam edecek...

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState<string | null>(null);
  const [quizCountdown, setQuizCountdown] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [footballMapMode, setFootballMapMode] = useState<string | null>(null);
  const [footballMapDifficulty, setFootballMapDifficulty] = useState<string | null>(null);
  const [footballMapCountdown, setFootballMapCountdown] = useState<number | null>(null);
  const [footballMapNextCountdown, setFootballMapNextCountdown] =
  useState<number | null>(null);
  const [footballMapCurrentPlayer, setFootballMapCurrentPlayer] =
  useState<Player | null>(null);
const [footballMapTimeLeft, setFootballMapTimeLeft] = useState(15);
const [footballMapAnswer, setFootballMapAnswer] = useState("");
const [footballMapScore, setFootballMapScore] = useState(0);
const [footballMapCorrectAnswers, setFootballMapCorrectAnswers] = useState(0);
const [footballMapQuestionNumber, setFootballMapQuestionNumber] = useState(0);
const [footballMapHintLevel, setFootballMapHintLevel] = useState(1);
const [footballMapFinished, setFootballMapFinished] = useState(false);
const [footballMapMessage, setFootballMapMessage] = useState("");
const [footballMapAnswerStatus, setFootballMapAnswerStatus] = useState<
  "idle" | "correct" | "wrong"
>("idle");

const [footballMapRoundResult, setFootballMapRoundResult] = useState<
  "correct" | "wrong" | null
>(null);

const footballMapUsedPlayerIds = useRef<number[]>([]);
const [footballMapSuggestionsOpen, setFootballMapSuggestionsOpen] =
  useState(false);
  const [clubs, setClubs] = useState<Club[]>([]);
const [players, setPlayers] = useState<Player[]>([]);
const [clubMapQuestions, setClubMapQuestions] = useState<any[]>([]);
const [careerMapQuestions, setCareerMapQuestions] =
  useState<CareerMapQuestion[]>([]);
const [mixedRouteQuestions, setMixedRouteQuestions] = useState<any[]>([]);
const [playerClubs, setPlayerClubs] = useState<PlayerClub[]>([]);


const [twoFormaTime, setTwoFormaTime] = useState<number | null>(null);
const [twoFormaTimeLeft, setTwoFormaTimeLeft] = useState<number | null>(null);
const [twoFormaCountdown, setTwoFormaCountdown] = useState<number | null>(null);
const [twoFormaClubs, setTwoFormaClubs] = useState<Club[]>([]);
const [twoFormaAnswer, setTwoFormaAnswer] = useState("");
const [twoFormaSuggestionsOpen, setTwoFormaSuggestionsOpen] = useState(false);
const [twoFormaAnswerStatus, setTwoFormaAnswerStatus] = useState<
  "idle" | "correct" | "wrong"
>("idle");
const [twoFormaAttempts, setTwoFormaAttempts] = useState(0);
const [twoFormaScore, setTwoFormaScore] = useState(0);
const [twoFormaMessage, setTwoFormaMessage] = useState("");
const [twoFormaRoundFinished, setTwoFormaRoundFinished] = useState(false);
const [dnaPlayers, setDnaPlayers] = useState<Player[]>([]);
const [dnaDifficulty, setDnaDifficulty] = useState<string | null>(null);
const [dnaCountdown, setDnaCountdown] = useState<number | null>(null);
const [dnaCurrentPlayer, setDnaCurrentPlayer] = useState<Player | null>(null);
const [dnaTimeLeft, setDnaTimeLeft] = useState(15);
const [dnaAnswer, setDnaAnswer] = useState("");
const [dnaSuggestionsOpen, setDnaSuggestionsOpen] = useState(false);
const [dnaScore, setDnaScore] = useState(0);
const [dnaCorrectAnswers, setDnaCorrectAnswers] = useState(0);
const [dnaHintLevel, setDnaHintLevel] = useState(0);
const [dnaQuestionNumber, setDnaQuestionNumber] = useState(0);
const [dnaFinished, setDnaFinished] = useState(false);
const [dnaMessage, setDnaMessage] = useState("");
const [dnaAnswerStatus, setDnaAnswerStatus] = useState<
  "idle" | "correct" | "wrong"
>("idle");
const [dnaTransition, setDnaTransition] = useState(false);
const dnaTransitionLock = useRef(false);
const dnaRoundId = useRef(0);
const dnaUsedPlayerIds = useRef<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  // SUPABASE'DEN SORULARI ÇEK
  useEffect(() => {
    async function loadQuestions() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
        setError("Sorular yüklenirken bir hata oluştu.");
        setLoading(false);
        return;
      }

      const shuffledQuestions = [...(data ?? [])].sort(
  () => Math.random() - 0.5
);

setQuestions(shuffledQuestions as Question[]);
      setLoading(false);
    }

    loadQuestions();
  }, []);



// BURAYA YENİ USEEFFECT GELECEK 👇

useEffect(() => {
  const loadTwoFormaData = async () => {
    const [clubsResult, playersResult, playerClubsResult] =
  await Promise.all([
    supabase.from("clubs").select("*").order("id"),
    supabase.from("players").select("*").order("id"),
    supabase
      .from("player_clubs")
      .select("player_id, club_id"),
  ]);

const [clubMapResult, careerMapResult, mixedRouteResult] =
  await Promise.all([
    supabase.from("club_map_db").select("*").order("id"),
    supabase.from("career_map_db").select("*").order("id"),
    supabase.from("mixed_route_db").select("*").order("id"),
  ]);
      

    if (clubsResult.error) {
      console.error("Kulüpler yüklenemedi:", clubsResult.error);
      return;
    }

    if (playersResult.error) {
      console.error("Oyuncular yüklenemedi:", playersResult.error);
      return;
    }

    if (playerClubsResult.error) {
      console.error(
        "Oyuncu-kulüp bağlantıları yüklenemedi:",
        playerClubsResult.error
      );
      return;
    }
    if (clubMapResult.error) {
  console.error("Kulüp Haritası verileri yüklenemedi:", clubMapResult.error);
  return;
}

if (careerMapResult.error) {
  console.error("Kariyer Haritası verileri yüklenemedi:", careerMapResult.error);
  return;
}

if (mixedRouteResult.error) {
  console.error("Karışık Rota verileri yüklenemedi:", mixedRouteResult.error);
  return;
}

    setClubs((clubsResult.data ?? []) as Club[]);
    setPlayers((playersResult.data ?? []) as Player[]);
    setDnaPlayers((playersResult.data ?? []) as Player[]);
    setPlayerClubs((playerClubsResult.data ?? []) as PlayerClub[]);
    setClubMapQuestions(clubMapResult.data ?? []);
setCareerMapQuestions(careerMapResult.data ?? []);
setMixedRouteQuestions(mixedRouteResult.data ?? []);
  };

  loadTwoFormaData();
}, []);
useEffect(() => {
  if (
    selectedMode !== "iki-forma" ||
    twoFormaTime === null ||
    twoFormaCountdown === null
  ) {
    return;
  }

  const interval = setInterval(() => {
    setTwoFormaCountdown((prev) => {
      if (prev === null) {
        return null;
      }

      if (prev <= 1) {
        clearInterval(interval);
        return null;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [selectedMode, twoFormaTime, twoFormaCountdown]);
useEffect(() => {
  if (
    selectedMode !== "iki-forma" ||
    twoFormaTime === null ||
    twoFormaCountdown !== null ||
    twoFormaRoundFinished
  ) {
    return;
  }

  const interval = setInterval(() => {
    setTwoFormaTimeLeft((prev) => {
      if (prev === null) {
        return null;
      }

      if (prev <= 1) {
        clearInterval(interval);
        setTwoFormaRoundFinished(true);
        setTwoFormaMessage("Süre doldu!");
        return 0;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [
  selectedMode,
  twoFormaTime,
  twoFormaCountdown,
  twoFormaRoundFinished,
]);
const normalizeAnswer = (value: string) => {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const submitTwoFormaAnswer = () => {
  if (
    twoFormaRoundFinished ||
    twoFormaTimeLeft === null ||
    twoFormaTimeLeft <= 0 ||
    twoFormaClubs.length !== 2
  ) {
    return;
  }

  const answer = normalizeAnswer(twoFormaAnswer);

  if (!answer) {
    setTwoFormaMessage("Bir oyuncu adı yaz.");
    return;
  }

  const firstClubPlayerIds = new Set(
    playerClubs
      .filter((pc) => pc.club_id === twoFormaClubs[0].id)
      .map((pc) => pc.player_id)
  );

  const commonPlayerIds = playerClubs
    .filter(
      (pc) =>
        pc.club_id === twoFormaClubs[1].id &&
        firstClubPlayerIds.has(pc.player_id)
    )
    .map((pc) => pc.player_id);

  const correctPlayer = players.find(
    (player) =>
      commonPlayerIds.includes(player.id) &&
      normalizeAnswer(player.name) === answer
  );

  if (correctPlayer) {
    setTwoFormaAnswerStatus("correct");
    const points =
      twoFormaTime === 5
        ? 100
        : twoFormaTime === 10
        ? 75
        : 50;

    setTwoFormaScore((prev) => prev + points);
    setTwoFormaMessage(
      `DOĞRU! ${correctPlayer.name} 🎯 +${points} puan`
    );
    setTwoFormaRoundFinished(true);

    return;
  }

  const remainingAttempts = twoFormaAttempts - 1;

  setTwoFormaAttempts(remainingAttempts);
  setTwoFormaAnswerStatus("wrong");

  if (remainingAttempts <= 0) {
    setTwoFormaMessage("YANLIŞ! Hakların bitti. ❌");
    setTwoFormaRoundFinished(true);
  } else {
    setTwoFormaMessage(
      `YANLIŞ! Bir hakkın daha var. ❌`
    );
  }
};
const getTwoFormaSuggestions = (value: string) => {
  const search = value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .trim();

  if (!search) return [];

  return players
    .filter((player) => {
      const name = player.name
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ı/g, "i");

      return name.includes(search);
    })
    .slice(0, 6);
};
const submitDNAAnswer = () => {
  if (
    dnaFinished ||
    dnaTimeLeft <= 0 ||
    !dnaCurrentPlayer
  ) {
    return;
  }

  const answer = normalizeAnswer(dnaAnswer);

  if (!answer) {
    setDnaMessage("Bir oyuncu adı yaz.");
    return;
  }

  const correctAnswer = normalizeAnswer(dnaCurrentPlayer.name);

  if (answer === correctAnswer) {
    setDnaAnswerStatus("correct");

    const points =
      dnaHintLevel === 1
        ? 100
        : dnaHintLevel === 2
        ? 75
        : 50;

    setDnaScore((prev) => prev + points);
    setDnaCorrectAnswers((prev) => prev + 1);

    setDnaMessage(
      `DOĞRU! ${dnaCurrentPlayer.name} 🎯 +${points} puan`
    );

    setDnaTimeLeft(0);

const roundId = dnaRoundId.current;

setTimeout(() => {
  if (roundId !== dnaRoundId.current) return;

  if (dnaQuestionNumber >= 10) {
    setDnaFinished(true);
  } else {
    goToNextDNAQuestion();
  }
}, 1000);

return;
  }

  setDnaAnswerStatus("wrong");

  if (dnaHintLevel < 3) {
    setDnaHintLevel((prev) => prev + 1);
    setDnaAnswer("");

    setDnaMessage(
      dnaHintLevel === 1
        ? "YANLIŞ! ⚠️ İkinci ipucu açıldı."
        : "YANLIŞ! 🔥 Son ipucu açıldı."
    );

    return;
  }

  setDnaMessage(
    `YANLIŞ! ❌ Doğru cevap: ${dnaCurrentPlayer.name}`
  );

  setDnaTimeLeft(0);

  const roundId = dnaRoundId.current;

setTimeout(() => {
  if (roundId !== dnaRoundId.current) return;

  if (dnaQuestionNumber >= 10) {
    setDnaFinished(true);
  } else {
    goToNextDNAQuestion();
  }
}, 1200);
};
const startNextDNAQuestion = () => {
  if (players.length === 0) return;
  dnaRoundId.current += 1;

  const availablePlayers = players.filter(
  (player) => !dnaUsedPlayerIds.current.includes(player.id)
);

  const randomPlayer =
    availablePlayers[
      Math.floor(Math.random() * availablePlayers.length)
    ];
dnaUsedPlayerIds.current.push(randomPlayer.id);
  setDnaCurrentPlayer(randomPlayer);
  setDnaTimeLeft(15);
  setDnaAnswer("");
  setDnaMessage("");
  setDnaHintLevel(1);
  setDnaAnswerStatus("idle");
  setDnaSuggestionsOpen(false);
  setDnaQuestionNumber((prev) => prev + 1);
};
const goToNextDNAQuestion = () => {
  if (dnaTransitionLock.current) return;

  dnaTransitionLock.current = true;
  setDnaTransition(true);

  setTimeout(() => {
    startNextDNAQuestion();
    setDnaTransition(false);
    setDnaAnswerStatus("idle");
setDnaSuggestionsOpen(false);
setDnaTransition(false);
setSelectedMode("football-dna");
    dnaTransitionLock.current = false;
  }, 1500);
};

const startFootballDNA = () => {
  if (players.length === 0) {
    console.error("Futbol DNA için oyuncu verisi yok.");
    return;
  }
dnaRoundId.current += 1;
  const randomPlayer =
    players[Math.floor(Math.random() * players.length)];

    dnaUsedPlayerIds.current = [randomPlayer.id];
  setDnaCurrentPlayer(randomPlayer);
  setDnaTimeLeft(15);
  setDnaAnswer("");
  setDnaScore(0);
  setDnaCorrectAnswers(0);
  setDnaQuestionNumber(1);
  setDnaFinished(false);
  setDnaMessage("");
  setDnaHintLevel(1);
  setDnaAnswerStatus("idle");
  setDnaSuggestionsOpen(false);
  setSelectedMode("football-dna");
  setGameStarted(false);
};
useEffect(() => {
  if (
    selectedMode !== "football-dna" ||
    dnaDifficulty === null ||
    dnaCurrentPlayer !== null
  ) {
    return;
  }

  setDnaCountdown(3);

  const interval = setInterval(() => {
    setDnaCountdown((prev) => {
      if (prev === null) {
        return null;
      }

      if (prev <= 1) {
        clearInterval(interval);

        setDnaCountdown(null);
        startFootballDNA();

        return null;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [selectedMode, dnaDifficulty, dnaCurrentPlayer]);
useEffect(() => {
  if (
    selectedMode !== "football-dna" ||
    dnaFinished ||
    dnaTimeLeft <= 0
  ) {
    return;
  }

  const interval = setInterval(() => {
    setDnaTimeLeft((prev) => {
      if (prev <= 1) {
  clearInterval(interval);
  setDnaTimeLeft(0);

  setDnaAnswerStatus("wrong");
  setDnaMessage(
    `SÜRE DOLDU! ⏰ Doğru cevap: ${dnaCurrentPlayer?.name}`
  );

  const roundId = dnaRoundId.current;

setTimeout(() => {
  if (roundId !== dnaRoundId.current) return;

  if (dnaQuestionNumber >= 10) {
    setDnaFinished(true);
  } else {
    goToNextDNAQuestion();
  }
}, 1500);

  return 0;
}

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [selectedMode, dnaFinished, dnaQuestionNumber]);
const getFootballMapPlayerPool = () => {
  const sourceQuestions =
    footballMapMode === "career"
      ? careerMapQuestions
      : footballMapMode === "mixed"
      ? mixedRouteQuestions
      : clubMapQuestions;

  const filteredQuestions = sourceQuestions.filter(
    (question) =>
      question.difficulty === footballMapDifficulty
  );

  const playerIds = new Set(
    filteredQuestions.map((question) => question.player_id)
  );

  return players.filter((player) =>
    playerIds.has(player.id)
  );
};

const startFootballMapGame = () => {
  if (players.length === 0) {
    console.error("Futbol Haritası için oyuncu verisi yok.");
    return;
  }

  const playerPool = getFootballMapPlayerPool();

if (playerPool.length === 0) {
  console.error("Bu zorluk seviyesi için oyuncu bulunamadı.");
  return;
}

const randomPlayer =
  playerPool[Math.floor(Math.random() * playerPool.length)];

footballMapUsedPlayerIds.current = [randomPlayer.id];

setFootballMapCurrentPlayer(randomPlayer);
  setFootballMapTimeLeft(15);
  setFootballMapAnswer("");
  setFootballMapScore(0);
  setFootballMapCorrectAnswers(0);
  setFootballMapQuestionNumber(1);
  setFootballMapHintLevel(1);
  setFootballMapFinished(false);
  setFootballMapMessage("");
  setFootballMapAnswerStatus("idle");
  setFootballMapRoundResult(null);
};
useEffect(() => {
  if (
    selectedMode !== "football-map" ||
    footballMapMode === null ||
    footballMapDifficulty === null
  ) {
    return;
  }

  setFootballMapCountdown(3);

  const interval = setInterval(() => {
    setFootballMapCountdown((prev) => {
      if (prev === null) {
        return null;
      }

      if (prev <= 1) {
  clearInterval(interval);
  setFootballMapCountdown(null);
  startFootballMapGame();

  return null;
}

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [
  selectedMode,
  footballMapMode,
  footballMapDifficulty,
]);
useEffect(() => {
  if (
    selectedMode !== "football-map" ||
    footballMapCurrentPlayer === null ||
    footballMapFinished ||
    footballMapTimeLeft <= 0
  ) {
    return;
  }

  const timer = setTimeout(() => {
    setFootballMapTimeLeft((prev) => {
      if (prev <= 1) {
  setFootballMapTimeLeft(0);
 setFootballMapMessage(
  `SÜRE DOLDU! ⏰ Doğru cevap: ${footballMapCurrentPlayer?.name}`
);
setFootballMapAnswerStatus("wrong");
setFootballMapRoundResult("wrong");

setTimeout(() => {
  if (footballMapQuestionNumber >= 10) {
    setFootballMapFinished(true);
  } else {
    startFootballMapNextCountdown();
  }
}, 1500);

  return 0;
}

      return prev - 1;
    });
  }, 1000);

  return () => clearTimeout(timer);
}, [
  selectedMode,
  footballMapCurrentPlayer,
  footballMapFinished,
  footballMapTimeLeft,
]);
const goToNextFootballMapQuestion = () => {
  if (footballMapQuestionNumber >= 10) {
    setFootballMapFinished(true);
    return;
  }

  const playerPool = getFootballMapPlayerPool();

const availablePlayers = playerPool.filter(
  (player) => !footballMapUsedPlayerIds.current.includes(player.id)
);
if (availablePlayers.length === 0) {
  setFootballMapFinished(true);
  return;
}

const randomPlayer =
  availablePlayers[
    Math.floor(Math.random() * availablePlayers.length)
  ];

footballMapUsedPlayerIds.current.push(randomPlayer.id);

setFootballMapCurrentPlayer(randomPlayer);
  setFootballMapTimeLeft(15);
  setFootballMapAnswer("");
  setFootballMapMessage("");
setFootballMapAnswerStatus("idle");
setFootballMapRoundResult(null);
  setFootballMapQuestionNumber((prev) => prev + 1);
  setFootballMapHintLevel(1);
};
const startFootballMapNextCountdown = () => {
  setFootballMapRoundResult(null);
  setFootballMapNextCountdown(3);

  let count = 3;

  const interval = setInterval(() => {
    count -= 1;

    if (count <= 0) {
      clearInterval(interval);
      setFootballMapNextCountdown(null);
      goToNextFootballMapQuestion();
      return;
    }

    setFootballMapNextCountdown(count);
  }, 1000);
};
const submitFootballMapAnswer = () => {
  setFootballMapSuggestionsOpen(false);
  if (
    footballMapCurrentPlayer === null ||
    footballMapFinished ||
    footballMapTimeLeft <= 0
  ) {
    return;
  }

  const normalizeName = (value: string) =>
    value
      .trim()
      .toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

  const userAnswer = normalizeName(footballMapAnswer);
  const correctAnswer = normalizeName(footballMapCurrentPlayer.name);

  if (userAnswer === "") {
    return;
  }

  if (userAnswer === correctAnswer) {
    const points =
      footballMapHintLevel === 1
        ? 100
        : footballMapHintLevel === 2
        ? 75
        : 50;

    setFootballMapScore((prev) => prev + points);
    setFootballMapCorrectAnswers((prev) => prev + 1);
    setFootballMapMessage(`DOĞRU! +${points} PUAN 🎯`);
setFootballMapAnswerStatus("correct");
setFootballMapRoundResult("correct");
setFootballMapTimeLeft(0);

setTimeout(() => {
  if (footballMapQuestionNumber >= 10) {
    setFootballMapFinished(true);
  } else {
    startFootballMapNextCountdown();
  }
}, 1500);
  } else {
  setFootballMapAnswerStatus("wrong");

  if (footballMapHintLevel < 3) {
  setFootballMapMessage(
    footballMapHintLevel === 1
      ? "YANLIŞ CEVAP ❌ — 2. İPUCU AÇILDI!"
      : "YANLIŞ CEVAP ❌ — 3. İPUCU AÇILDI!"
  );

  setFootballMapAnswer("");
  setFootballMapSuggestionsOpen(false);
  setFootballMapHintLevel((prev) => prev + 1);
} else {
    setFootballMapMessage(
      `YANLIŞ! ❌ Doğru cevap: ${footballMapCurrentPlayer?.name}`
    );

    setFootballMapAnswer("");
setFootballMapSuggestionsOpen(false);
    setFootballMapRoundResult("wrong");
    setFootballMapTimeLeft(0);

    setTimeout(() => {
      if (footballMapQuestionNumber >= 10) {
        setFootballMapFinished(true);
      } else {
        startFootballMapNextCountdown();
      }
    }, 1500);
  }
}
};
const startTwoForma = (duration: number) => {
  if (clubs.length < 2 || playerClubs.length === 0) {
    console.error("İki Forma için yeterli veri yok.");
    return;
  }

  const validPairs: [Club, Club][] = [];

  for (let i = 0; i < clubs.length; i++) {
    for (let j = i + 1; j < clubs.length; j++) {
      const clubA = clubs[i];
      const clubB = clubs[j];

      const playersInA = new Set(
        playerClubs
          .filter((pc) => pc.club_id === clubA.id)
          .map((pc) => pc.player_id)
      );

      const hasCommonPlayer = playerClubs.some(
        (pc) =>
          pc.club_id === clubB.id &&
          playersInA.has(pc.player_id)
      );

      if (hasCommonPlayer) {
        validPairs.push([clubA, clubB]);
      }
    }
  }

  if (validPairs.length === 0) {
    console.error(
      "Ortak oyuncusu olan kulüp çifti bulunamadı."
    );
    return;
  }

  const randomPair =
    validPairs[
      Math.floor(Math.random() * validPairs.length)
    ];

 setTwoFormaTime(duration);
setTwoFormaTimeLeft(duration);
setTwoFormaCountdown(3);
setTwoFormaClubs(randomPair);
setTwoFormaAnswer("");

  if (duration === 15) {
    setTwoFormaAttempts(2);
  } else {
    setTwoFormaAttempts(1);
  }

  setTwoFormaScore(0);
  setTwoFormaMessage("");
  setTwoFormaRoundFinished(false);
  setTwoFormaAnswerStatus("idle");
setGameStarted(false);

setSelectedMode("iki-forma");

};
function startGame() {
  if (questions.length === 0) return;

  setGameStarted(true);
  setCurrentQuestion(0);
  setScore(0);
  setCorrectAnswers(0);
  setCombo(0);
  setTimeLeft(15);
  setSelectedAnswer(null);
  setFinished(false);
}

  function nextQuestion() {
    if (currentQuestion + 1 >= questions.length) {
      setFinished(true);
      return;
    }

    setCurrentQuestion((prev) => prev + 1);
    setTimeLeft(15);
    setSelectedAnswer(null);
  }

  function answerQuestion(option: string) {
    if (selectedAnswer !== null) return;

    const question = questions[currentQuestion];

    setSelectedAnswer(option);

    if (option === question.answer) {
      const newCombo = combo + 1;

      let points = 100;

      if (newCombo >= 3) {
        points = 150;
      }

      if (newCombo >= 5) {
        points = 200;
      }

      setScore((prev) => prev + points);
      setCorrectAnswers((prev) => prev + 1);
      setCombo(newCombo);
    } else {
      setCombo(0);
    }

    setTimeout(() => {
      nextQuestion();
    }, 1000);
  }

  // ZAMANLAYICI
  useEffect(() => {
  if (
    selectedMode !== "quiz" ||
    quizDifficulty === null ||
    gameStarted
  ) {
    return;
  }

  setQuizCountdown(3);

  const interval = setInterval(() => {
    setQuizCountdown((prev) => {
      if (prev === null) {
        return null;
      }

      if (prev <= 1) {
        clearInterval(interval);

        setQuizCountdown(null);
        startGame();

        return null;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [selectedMode, quizDifficulty, gameStarted]);
  useEffect(() => {
    if (!gameStarted || finished || selectedAnswer !== null) {
      return;
    }

    if (timeLeft <= 0) {
      setSelectedAnswer("TIMEOUT");
      setCombo(0);

      setTimeout(() => {
        nextQuestion();
      }, 1000);

      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    timeLeft,
    gameStarted,
    finished,
    selectedAnswer,
  ]);

  // YÜKLENİYOR
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-800 to-black flex items-center justify-center px-6">
        <div className="text-center text-white">
          <div className="text-6xl mb-6 animate-bounce">⚽</div>

          <h1 className="text-3xl font-black">
            SORULAR YÜKLENİYOR...
          </h1>

          <p className="mt-3 text-gray-400">
            Supabase bağlantısı kuruluyor.
          </p>
        </div>
      </main>
    );
  }

  // HATA
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-950 via-red-800 to-black flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl bg-white/10 p-10 text-center text-white backdrop-blur-xl">
          <div className="text-6xl">❌</div>

          <h1 className="mt-5 text-3xl font-black">
            BİR ŞEYLER TERS GİTTİ
          </h1>

          <p className="mt-4 text-gray-300">
            {error}
          </p>

          <p className="mt-5 text-sm text-gray-400">
            Supabase bağlantısını ve RLS ayarlarını kontrol et.
          </p>
        </div>
      </main>
    );
  }

  // SORU YOKSA
  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-yellow-950 via-green-900 to-black flex items-center justify-center px-6">
        <div className="text-center text-white">
          <div className="text-7xl">🤔</div>

          <h1 className="mt-5 text-4xl font-black">
            HENÜZ SORU YOK
          </h1>

          <p className="mt-3 text-gray-300">
            Supabase questions tablosuna soru eklemelisin.
          </p>
        </div>
      </main>
    );
  }
  if (selectedMode === "football-dna" && dnaDifficulty === null) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-900 to-black flex items-center justify-center px-6">
        <div className="w-full max-w-2xl text-center text-white">
          <div className="text-6xl mb-5">🧬</div>

          <h1 className="text-4xl font-black">
            FUTBOL DNA
          </h1>

          <p className="mt-3 text-gray-300">
            Futbol bilgini hangi seviyede test etmek istiyorsun?
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <button
              onClick={() => setDnaDifficulty("kolay")}
              className="rounded-3xl border border-green-400/20 bg-green-500/10 p-6 transition hover:-translate-y-1 hover:bg-green-500/20"
            >
              <div className="text-4xl">🟢</div>

              <h2 className="mt-4 text-2xl font-black">
                Kolay
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                Dünyaca tanınan futbolcular.
              </p>
            </button>

            <button
              onClick={() => setDnaDifficulty("orta")}
              className="rounded-3xl border border-yellow-400/20 bg-yellow-500/10 p-6 transition hover:-translate-y-1 hover:bg-yellow-500/20"
            >
              <div className="text-4xl">🟡</div>

              <h2 className="mt-4 text-2xl font-black">
                Normal
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                Düzenli futbol takipçilerinin bilebileceği oyuncular.
              </p>
            </button>

            <button
              onClick={() => setDnaDifficulty("zor")}
              className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 transition hover:-translate-y-1 hover:bg-red-500/20"
            >
              <div className="text-4xl">🔴</div>

              <h2 className="mt-4 text-2xl font-black">
                Zor
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                Gerçek futbol meraklılarını zorlayacak oyuncular.
              </p>
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedMode(null);
              setDnaDifficulty(null);
            }}
            className="mt-8 text-gray-400 hover:text-white transition"
          >
            ← Ana Menü
          </button>
        </div>
      </main>
    );
  }
  if (selectedMode === "football-map" && footballMapMode === null) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black flex items-center justify-center px-6">
      <div className="w-full max-w-4xl text-center text-white">
        <div className="text-6xl mb-5">🗺️</div>

        <h1 className="text-4xl font-black">
          FUTBOL HARİTASI
        </h1>

        <p className="mt-3 text-gray-300">
          Oyuncunun futbol yolculuğunu takip et ve kim olduğunu bul.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <button
            onClick={() => setFootballMapMode("club")}
            className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-7 transition hover:-translate-y-1 hover:bg-blue-500/20"
          >
            <div className="text-5xl">👕</div>

            <h2 className="mt-4 text-2xl font-black">
              Kulüp Haritası
            </h2>

            <p className="mt-2 text-sm text-gray-300">
              Oynadığı kulüplerden yola çıkarak futbolcuyu bul.
            </p>
          </button>

          <button
            onClick={() => setFootballMapMode("career")}
            className="rounded-3xl border border-purple-400/20 bg-purple-500/10 p-7 transition hover:-translate-y-1 hover:bg-purple-500/20"
          >
            <div className="text-5xl">📖</div>

            <h2 className="mt-4 text-2xl font-black">
              Kariyer Haritası
            </h2>

            <p className="mt-2 text-sm text-gray-300">
              Kariyeri hakkında verilen bilgilerden futbolcuyu bul.
            </p>
          </button>

          <button
            onClick={() => setFootballMapMode("mixed")}
            className="rounded-3xl border border-orange-400/20 bg-orange-500/10 p-7 transition hover:-translate-y-1 hover:bg-orange-500/20"
          >
            <div className="text-5xl">🔥</div>

            <h2 className="mt-4 text-2xl font-black">
              Karışık Rota
            </h2>

            <p className="mt-2 text-sm text-gray-300">
              Kulüp, kariyer ve farklı ipuçlarını birlikte kullan.
            </p>
          </button>
        </div>

        <button
          onClick={() => {
            setSelectedMode(null);
            setFootballMapMode(null);
          }}
          className="mt-8 text-gray-400 hover:text-white transition"
        >
          ← Ana Menü
        </button>
      </div>
    </main>
  );
}
if (
  selectedMode === "football-map" &&
  footballMapMode !== null &&
  footballMapDifficulty === null
) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black flex items-center justify-center px-6">
      <div className="w-full max-w-3xl text-center text-white">
        <div className="text-6xl mb-5">🗺️</div>

        <p className="text-lg font-bold text-blue-300">
          FUTBOL HARİTASI
        </p>

        <h1 className="mt-3 text-3xl font-black">
          {footballMapMode === "club" && "👕 KULÜP HARİTASI"}
          {footballMapMode === "career" && "📖 KARİYER HARİTASI"}
          {footballMapMode === "mixed" && "🔥 KARIŞIK ROTA"}
        </h1>

        <p className="mt-3 text-gray-300">
          Zorluk seviyeni seç.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <button
            onClick={() => setFootballMapDifficulty("kolay")}
            className="rounded-3xl border border-green-400/20 bg-green-500/10 p-7 transition hover:-translate-y-1 hover:bg-green-500/20"
          >
            <div className="text-5xl">🟢</div>

            <h2 className="mt-4 text-2xl font-black">
              Kolay
            </h2>

            <p className="mt-2 text-sm text-gray-300">
              Daha bilinen futbolcular ve daha belirgin ipuçları.
            </p>
          </button>

          <button
            onClick={() => setFootballMapDifficulty("orta")}
            className="rounded-3xl border border-yellow-400/20 bg-yellow-500/10 p-7 transition hover:-translate-y-1 hover:bg-yellow-500/20"
          >
            <div className="text-5xl">🟡</div>

            <h2 className="mt-4 text-2xl font-black">
              Normal
            </h2>

            <p className="mt-2 text-sm text-gray-300">
              Düzenli futbol takipçilerini zorlayacak ipuçları.
            </p>
          </button>

          <button
            onClick={() => setFootballMapDifficulty("zor")}
            className="rounded-3xl border border-red-400/20 bg-red-500/10 p-7 transition hover:-translate-y-1 hover:bg-red-500/20"
          >
            <div className="text-5xl">🔴</div>

            <h2 className="mt-4 text-2xl font-black">
              Zor
            </h2>

            <p className="mt-2 text-sm text-gray-300">
              Gerçek futbol meraklılarını zorlayacak oyuncular ve ipuçları.
            </p>
          </button>
        </div>

        <button
          onClick={() => {
            setFootballMapDifficulty(null);
            setFootballMapMode(null);
          }}
          className="mt-8 text-gray-400 hover:text-white transition"
        >
          ← Mod Seçimine Dön
        </button>
      </div>
    </main>
  );
}
if (
  selectedMode === "football-map" &&
  footballMapMode !== null &&
  footballMapDifficulty !== null &&
  footballMapCountdown !== null
) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black flex items-center justify-center px-6">
      <div className="text-center text-white">
        <div className="text-6xl mb-6">🗺️</div>

        <p className="text-lg font-bold text-blue-300">
          FUTBOL HARİTASI
        </p>

        <h1 className="mt-3 text-3xl font-black">
          {footballMapMode === "club" && "👕 KULÜP HARİTASI"}
          {footballMapMode === "career" && "📖 KARİYER HARİTASI"}
          {footballMapMode === "mixed" && "🔥 KARIŞIK ROTA"}
        </h1>

        <div className="mt-10 text-9xl font-black text-white">
          {footballMapCountdown}
        </div>

        <p className="mt-6 text-xl font-bold text-gray-300">
          HAZIRLAN...
        </p>
      </div>
    </main>
  );
}
if (
  selectedMode === "football-map" &&
  footballMapFinished &&
  footballMapCurrentPlayer !== null
) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black flex items-center justify-center px-6">
      <div className="w-full max-w-2xl text-center">
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <div className="text-6xl">🗺️</div>

          <p className="mt-5 text-sm font-black tracking-widest text-blue-600">
            FUTBOL HARİTASI
          </p>

          <h1 className="mt-2 text-4xl font-black text-gray-900">
            SÜRE DOLDU!
          </h1>

          <p className="mt-5 text-gray-500">
            Doğru cevap:
          </p>

          <p className="mt-2 text-3xl font-black text-blue-600">
            {footballMapCurrentPlayer.name}
          </p>

          <div className="mt-6 rounded-2xl bg-gray-100 p-5">
            <p className="text-sm font-bold text-gray-500">
              TOPLAM PUAN
            </p>

            <p className="mt-1 text-3xl font-black text-gray-900">
              {footballMapScore}
            </p>

            <p className="mt-3 text-sm font-bold text-gray-500">
              🎯 {footballMapCorrectAnswers} doğru
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={() => {
                setFootballMapFinished(false);
                startFootballMapGame();
              }}
              className="w-full rounded-2xl bg-blue-600 px-5 py-4 font-black text-white transition hover:bg-blue-500"
            >
              TEKRAR OYNA
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMode(null);
                setFootballMapMode(null);
                setFootballMapDifficulty(null);
                setFootballMapCurrentPlayer(null);
                setFootballMapFinished(false);
              }}
              className="w-full rounded-2xl bg-gray-200 px-5 py-4 font-black text-gray-800 transition hover:bg-gray-300"
            >
              ANA MENÜ
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
if (
  selectedMode === "football-map" &&
  footballMapCurrentPlayer !== null &&
  !footballMapFinished
) {
  const footballMapPlayerClubs = playerClubs
    .filter(
      (pc) => pc.player_id === footballMapCurrentPlayer.id
    )
    .map((pc) =>
      clubs.find((club) => club.id === pc.club_id)
    )
    .filter((club): club is Club => Boolean(club));
    const getVisibleClubCount = (
  totalClubs: number,
  hintLevel: number
) => {
  const ratios =
    footballMapDifficulty === "kolay"
      ? [0.5, 0.75, 1]
      : footballMapDifficulty === "orta"
      ? [0.35, 0.65, 1]
      : [0.25, 0.5, 1];

  const ratio = ratios[Math.min(hintLevel - 1, 2)];

  return Math.min(
    totalClubs,
    Math.max(1, Math.ceil(totalClubs * ratio))
  );
};

const visibleFootballMapClubs = footballMapPlayerClubs.slice(
  0,
  getVisibleClubCount(
    footballMapPlayerClubs.length,
    footballMapHintLevel
  )
);
const currentCareerMapQuestion =
  footballMapCurrentPlayer === null
    ? null
    : careerMapQuestions.find(
        (question) =>
          question.player_id === footballMapCurrentPlayer.id &&
          question.difficulty === footballMapDifficulty
      );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black px-6 py-10">
    {footballMapRoundResult !== null && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
    <div
      className={`w-[min(90vw,620px)] rounded-[2rem] border-2 p-10 text-center shadow-2xl ${
        footballMapRoundResult === "correct"
          ? "border-emerald-400 bg-emerald-950/90 shadow-emerald-500/30"
          : "border-red-400 bg-red-950/90 shadow-red-500/30"
      }`}
    >
      <div
  className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 text-6xl shadow-2xl ${
    footballMapRoundResult === "correct"
      ? "border-emerald-300 bg-emerald-400/10 shadow-emerald-500/40 animate-pulse"
      : "border-red-300 bg-red-400/10 shadow-red-500/40 animate-pulse"
  }`}
>
  {footballMapRoundResult === "correct" ? "✓" : "✕"}
</div>

      <h2
  className={`mt-6 text-5xl font-black tracking-tight drop-shadow-lg ${
    footballMapRoundResult === "correct"
      ? "text-emerald-300"
      : "text-red-300"
  }`}
>
  {footballMapRoundResult === "correct"
    ? "DOĞRU CEVAP!"
    : "SÜRE DOLDU!"}
</h2>

<p className="mt-2 text-sm font-black tracking-[0.35em] text-gray-400">
  FUTBOL HARİTASI
</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 shadow-inner">
  <p className="text-xs font-black tracking-[0.3em] text-gray-500">
    DOĞRU CEVAP
  </p>

  <p className="mt-2 text-4xl font-black tracking-tight text-white">
    {footballMapCurrentPlayer?.name}
  </p>
</div>

     {footballMapRoundResult === "correct" && (
  <div className="mt-5 inline-flex flex-col items-center rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-8 py-4 shadow-lg shadow-yellow-500/10">
    <span className="text-xs font-black tracking-[0.3em] text-yellow-400">
      KAZANILAN PUAN
    </span>

    <span className="mt-1 text-4xl font-black text-yellow-300">
      +{footballMapHintLevel === 1
        ? 100
        : footballMapHintLevel === 2
        ? 75
        : 50}
    </span>
  </div>
)}

      {footballMapRoundResult === "wrong" && (
  <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4">
    <p className="text-xs font-black tracking-[0.3em] text-red-300">
      TUR SONUCU
    </p>

    <p className="mt-2 text-lg font-bold text-gray-300">
      Bu turda puan kazanamadın.
    </p>
  </div>
)}

      <div className="mt-8 flex items-center justify-center gap-3 border-t border-white/10 pt-6">
  <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
  <span className="text-xs font-black tracking-[0.3em] text-blue-300">
    SIRADAKİ SORU HAZIRLANIYOR
  </span>
  <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
</div>
    </div>
  </div>
)}

      {footballMapNextCountdown !== null && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md">
    <div className="relative text-center text-white">

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-48 w-48 rounded-full border-4 border-blue-500/20 animate-ping" />
      </div>

      <p className="relative text-xs font-black tracking-[0.5em] text-blue-300 uppercase">
  HAZIRLAN
</p>

      <div
        key={footballMapNextCountdown}
        className="relative mt-3 text-[10rem] font-black leading-none text-transparent bg-gradient-to-b from-white via-blue-200 to-blue-500 bg-clip-text drop-shadow-[0_0_40px_rgba(59,130,246,0.9)] animate-pulse"
      >
        {footballMapNextCountdown}
      </div>

      <div className="relative mt-5">
        <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-6 py-2 text-sm font-black tracking-[0.25em] text-blue-200">
          HAZIR OL ⚽
        </span>
      </div>

    </div>
  </div>
)}
      <div className="mx-auto w-full max-w-3xl">

        <div className="mb-8 text-center text-white">
          <p className="text-sm font-bold tracking-widest text-blue-300">
            🗺️ FUTBOL HARİTASI
          </p>

          <h1 className="mt-2 text-4xl font-black">
            {footballMapMode === "club" && "👕 KULÜP HARİTASI"}
            {footballMapMode === "career" && "📖 KARİYER HARİTASI"}
            {footballMapMode === "mixed" && "🔥 KARIŞIK ROTA"}
          </h1>

          <p className="mt-3 text-gray-400">
            İpuçlarını takip et ve futbolcuyu bul.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-2xl md:p-8">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-black tracking-widest text-gray-400">
                SORU
              </p>

              <p className="text-xl font-black text-gray-900">
                {footballMapQuestionNumber}
                <span className="text-gray-400"> / 10</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold text-gray-400">
                PUAN
              </p>

              <p className="text-2xl font-black text-blue-600">
                {footballMapScore}
              </p>
            </div>
          </div>

          <div className="mb-8 flex items-center justify-between rounded-2xl bg-gray-100 p-5">
            <div>
              <p className="text-xs font-bold text-gray-500">
                SÜRE
              </p>

              <p
                className={`text-4xl font-black ${
                  footballMapTimeLeft <= 5
                    ? "text-red-500"
                    : "text-gray-900"
                }`}
              >
                {footballMapTimeLeft}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold text-gray-500">
                İPUCU
              </p>

              <p className="text-lg font-black text-blue-600">
                {footballMapHintLevel}
              </p>
            </div>
          </div>

          <div className="mb-8 h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full transition-all duration-1000 ${
                footballMapTimeLeft <= 5
                  ? "bg-red-500"
                  : "bg-blue-500"
              }`}
              style={{
                width: `${(footballMapTimeLeft / 15) * 100}%`,
              }}
            />
          </div>

          <div className="rounded-3xl bg-slate-100 p-6">
            <p className="text-xs font-black tracking-widest text-gray-500">
              🔎 İPUCU
            </p>

            {footballMapMode === "club" && (
              <>
                <h2 className="mt-2 text-2xl font-black text-gray-900">
                  Bu futbolcu bu kulüplerde forma giydi:
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
  {visibleFootballMapClubs.map((club, index) => (
    <div
      key={club.id}
      className="group flex items-center gap-3 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white px-4 py-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-sm">
        {index + 1}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-500">
          KULÜP İPUCU
        </p>

        <p className="truncate text-base font-black text-gray-900">
          {club.name}
        </p>
      </div>

      <div className="ml-auto text-lg opacity-60 transition group-hover:scale-110">
        ⚽
      </div>
    </div>
  ))}
</div>
              </>
            )}

            {footballMapMode === "career" && (
              <>
                <h2 className="mt-2 text-2xl font-black text-gray-900">
  Kariyer ipucu:
</h2>

<div className="mt-5 space-y-3">
  {footballMapHintLevel >= 1 &&
    currentCareerMapQuestion?.hint_1 && (
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-blue-500">
          1. İPUCU
        </p>
        <p className="mt-1 font-bold text-gray-900">
          {currentCareerMapQuestion.hint_1}
        </p>
      </div>
    )}

  {footballMapHintLevel >= 2 &&
    currentCareerMapQuestion?.hint_2 && (
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-blue-500">
          2. İPUCU
        </p>
        <p className="mt-1 font-bold text-gray-900">
          {currentCareerMapQuestion.hint_2}
        </p>
      </div>
    )}

  {footballMapHintLevel >= 3 &&
    currentCareerMapQuestion?.hint_3 && (
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-blue-500">
          3. İPUCU
        </p>
        <p className="mt-1 font-bold text-gray-900">
          {currentCareerMapQuestion.hint_3}
        </p>
      </div>
    )}
</div>
              </>
            )}

            {footballMapMode === "mixed" && (
              <>
                <h2 className="mt-2 text-2xl font-black text-gray-900">
                  Karışık rota
                </h2>

                <p className="mt-3 text-gray-500">
                  Kulüp ve kariyer ipuçları birlikte kullanılacak.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {footballMapPlayerClubs.map((club) => (
                    <span
                      key={club.id}
                      className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-800 shadow-sm"
                    >
                      {club.name}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

         <div className="relative mt-6">
  <input
    type="text"
    value={footballMapAnswer}
   onChange={(e) => {
  setFootballMapAnswer(e.target.value);
  setFootballMapSuggestionsOpen(
    e.target.value.trim() !== ""
  );
}}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      submitFootballMapAnswer();
    }
  }}
    disabled={footballMapFinished || footballMapTimeLeft === 0}
    placeholder="Futbolcunun adını yaz..."
    className={`w-full rounded-2xl border-2 px-5 py-4 text-lg text-gray-900 outline-none transition focus:ring-4 ${
  footballMapAnswerStatus === "correct"
    ? "border-emerald-500 bg-emerald-50 focus:ring-emerald-200"
    : footballMapAnswerStatus === "wrong"
    ? "border-red-500 bg-red-50 focus:ring-red-200"
    : "border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-100"
}`}
    autoFocus
  />

  {footballMapSuggestionsOpen &&
  footballMapAnswer.trim() !== "" &&
  !footballMapFinished &&
  footballMapTimeLeft !== 0 &&
  players.filter((player) =>
    player.name
      .toLocaleLowerCase("tr-TR")
      .includes(
        footballMapAnswer.toLocaleLowerCase("tr-TR")
      )
  ).length > 0 && (
    <div className="w-full mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
      {players
        .filter((player) =>
          player.name
            .toLocaleLowerCase("tr-TR")
            .includes(
              footballMapAnswer.toLocaleLowerCase("tr-TR")
            )
        )
        .slice(0, 6)
        .map((player) => (
          <button
            key={player.id}
            type="button"
            onClick={() => {
              setFootballMapAnswer(player.name);
              setFootballMapSuggestionsOpen(false);
            }}
            className="group flex w-full items-center justify-between border-b border-slate-200 bg-white px-5 py-4 text-left text-gray-900 transition-all duration-200 last:border-b-0 hover:bg-blue-50 hover:px-6"
          >
            <span className="font-black">
              {player.name}
            </span>

            {player.position && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                {player.position}
              </span>
            )}
          </button>
        ))}
    </div>
  )}

  <button
  type="button"
  onClick={submitFootballMapAnswer}
  disabled={
    footballMapFinished ||
    footballMapTimeLeft === 0 ||
    footballMapAnswer.trim() === ""
  }
  className="mt-4 w-full rounded-2xl border border-blue-400/30 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-5 py-4 text-lg font-black text-white shadow-lg shadow-blue-900/30 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/20 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
>
  ⚽ TAHMİN ET
</button>

  {footballMapMessage && (
  <div
    className={`mt-5 rounded-2xl border p-4 text-center font-black shadow-sm ${
      footballMapAnswerStatus === "correct"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : footballMapAnswerStatus === "wrong"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-gray-200 bg-gray-100 text-gray-800"
    }`}
  >
    {footballMapMessage}
  </div>
)}
</div>
          </div>

          <div className="mt-6 flex justify-center gap-8 text-sm font-bold text-gray-400">
            <span>
              🎯 {footballMapCorrectAnswers} doğru
            </span>

            <span>
              🧭 {footballMapQuestionNumber}/10
            </span>
          </div>

        </div>
    </main>
  );
}
  // ANA SAYFA
    if (selectedMode === "quiz" && quizDifficulty === null) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-800 to-black flex items-center justify-center px-6">
        <div className="w-full max-w-2xl text-center text-white">
          <div className="text-6xl mb-5">🧠</div>

          <h1 className="text-4xl font-black">
            KLASİK QUIZ
          </h1>

          <p className="mt-3 text-gray-300">
            Futbol bilgini hangi seviyede test etmek istiyorsun?
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <button
              onClick={() => setQuizDifficulty("kolay")}
              className="rounded-3xl border border-green-400/20 bg-green-500/10 p-6 transition hover:-translate-y-1 hover:bg-green-500/20"
            >
              <div className="text-4xl">🟢</div>

              <h2 className="mt-4 text-2xl font-black">
                Kolay
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                Futbolu takip eden herkesin bilebileceği sorular.
              </p>
            </button>

            <button
              onClick={() => setQuizDifficulty("orta")}
              className="rounded-3xl border border-yellow-400/20 bg-yellow-500/10 p-6 transition hover:-translate-y-1 hover:bg-yellow-500/20"
            >
              <div className="text-4xl">🟡</div>

              <h2 className="mt-4 text-2xl font-black">
                Normal
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                Düzenli futbol takipçilerinin zorlanacağı sorular.
              </p>
            </button>

            <button
              onClick={() => setQuizDifficulty("zor")}
              className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 transition hover:-translate-y-1 hover:bg-red-500/20"
            >
              <div className="text-4xl">🔴</div>

              <h2 className="mt-4 text-2xl font-black">
                Zor
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                Gerçek futbol meraklılarını zorlayacak sorular.
              </p>
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedMode(null);
              setQuizDifficulty(null);
            }}
            className="mt-8 text-gray-400 hover:text-white transition"
          >
            ← Ana Menü
          </button>
        </div>
      </main>
    );
  }
    if (
    selectedMode === "quiz" &&
    quizDifficulty !== null &&
    !gameStarted &&
    quizCountdown !== null
  ) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-800 to-black flex items-center justify-center px-6">
        <div className="text-center text-white">
          <div className="text-6xl mb-6">🧠</div>

          <p className="text-lg font-bold text-green-300">
            KLASİK QUIZ
          </p>

          <h1 className="mt-3 text-3xl font-black">
            {quizDifficulty === "kolay" && "🟢 KOLAY"}
            {quizDifficulty === "orta" && "🟡 NORMAL"}
            {quizDifficulty === "zor" && "🔴 ZOR"}
          </h1>

          <div className="mt-10 text-9xl font-black text-white">
            {quizCountdown}
          </div>

          <p className="mt-6 text-xl font-bold text-gray-300">
            HAZIRLAN...
          </p>
        </div>
      </main>
    );
  }
    if (
    selectedMode === "football-dna" &&
    dnaDifficulty !== null &&
    dnaCurrentPlayer === null &&
    dnaCountdown !== null
  ) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-900 to-black flex items-center justify-center px-6">
        <div className="text-center text-white">
          <div className="text-6xl mb-6">🧬</div>

          <p className="text-lg font-bold text-purple-300">
            FUTBOL DNA
          </p>

          <h1 className="mt-3 text-3xl font-black">
            {dnaDifficulty === "kolay" && "🟢 KOLAY"}
            {dnaDifficulty === "orta" && "🟡 NORMAL"}
            {dnaDifficulty === "zor" && "🔴 ZOR"}
          </h1>

          <div className="mt-10 text-9xl font-black text-white">
            {dnaCountdown}
          </div>

          <p className="mt-6 text-xl font-bold text-gray-300">
            HAZIRLAN...
          </p>
        </div>
      </main>
    );
  }
  if (selectedMode === "football-dna" && dnaCurrentPlayer) {
  const dnaPlayerClubs = playerClubs
    .filter((pc) => pc.player_id === dnaCurrentPlayer.id)
    .map((pc) => clubs.find((club) => club.id === pc.club_id))
    .filter((club): club is Club => Boolean(club));

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-6 py-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(45,25,0,0.78), rgba(10,5,0,0.94)), url('https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=2400&q=85')",
      }}
    >
      <div className="w-full max-w-3xl">
        <div className="text-center text-white mb-8">
          <p className="text-yellow-300 text-sm font-bold tracking-widest">
            FUTBOL DNA
          </p>

          <h1 className="text-4xl md:text-5xl font-black mt-2">
            KİM BU OYUNCU?
          </h1>

          <p className="text-white/60 mt-3">
            İpuçlarını kullan ve futbolcuyu bul.
          </p>
        </div>
{dnaTransition && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div className="text-center text-white">
      <div className="text-6xl animate-pulse">
        ⚡
      </div>

      <p className="mt-4 text-3xl font-black tracking-widest">
        SONRAKİ SORU
      </p>

      <p className="mt-2 text-xl font-bold text-yellow-400">
        {dnaQuestionNumber + 1} / 10
      </p>
    </div>
  </div>
)}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="mb-5 flex items-center justify-between">
  <div>
    <p className="text-xs font-black tracking-widest text-gray-400">
      FUTBOL DNA
    </p>

    <p className="text-xl font-black text-gray-900">
      Soru {dnaQuestionNumber}
      <span className="text-gray-400"> / 10</span>
    </p>
  </div>

  <div className="text-right">
    <p className="text-xs font-bold text-gray-400">
      DOĞRU
    </p>

    <p className="text-lg font-black text-green-600">
      {dnaCorrectAnswers}
    </p>
  </div>
</div>
 
<div className="mb-6 flex gap-1.5">
  {Array.from({ length: 10 }).map((_, index) => (
    <div
      key={index}
      className={`h-2 flex-1 rounded-full transition-all duration-500 ${
        index < dnaQuestionNumber
          ? "bg-yellow-500"
          : "bg-gray-200"
      }`}
    />
  ))}
</div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-500 text-sm font-bold">
                SÜRE
              </p>

              <div className="text-4xl font-black text-gray-900">
                {dnaTimeLeft}
              </div>
            </div>

            <div className="text-right">
              <p className="text-gray-500 text-sm font-bold">
                PUAN
              </p>

              <div className="text-2xl font-black text-yellow-600">
                {dnaScore}
              </div>
            </div>
          </div>

          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-yellow-500 transition-all duration-1000"
              style={{
                width: `${(dnaTimeLeft / 15) * 100}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gray-100 p-5">
              <p className="text-xs font-bold text-gray-500 uppercase">
                🌍 Uyruk
              </p>

              <p className="text-xl font-black text-gray-900 mt-2">
                {dnaCurrentPlayer.nationality || "Bilinmiyor"}
              </p>
            </div>

            {dnaHintLevel >= 2 && (
  <div className="rounded-2xl bg-gray-100 p-5">
    <p className="text-xs font-bold text-gray-500 uppercase">
      ⚽ Pozisyon
    </p>

    <p className="text-xl font-black text-gray-900 mt-2">
      {dnaCurrentPlayer.position || "Bilinmiyor"}
    </p>
  </div>
)}
          </div>

          {dnaHintLevel >= 3 && (
  <div className="mt-4 rounded-2xl bg-gray-100 p-5">
    <p className="text-xs font-bold text-gray-500 uppercase">
      🏟️ Forma Giydiği Kulüpler
    </p>

    <div className="flex flex-wrap gap-2 mt-3">
      {dnaPlayerClubs.map((club) => (
        <span
          key={club.id}
          className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-800 shadow-sm"
        >
          {club.name}
        </span>
      ))}
    </div>
  </div>
)}

          <div className="mt-6">
            <input
              type="text"
              value={dnaAnswer}
              onChange={(e) => {
  setDnaAnswer(e.target.value);
  setDnaSuggestionsOpen(e.target.value.trim() !== "");
}}
              placeholder="Oyuncunun adını yaz..."
              disabled={dnaFinished || dnaTimeLeft === 0}
              autoFocus
              className={`w-full rounded-2xl border-2 px-5 py-4 text-lg text-gray-900 outline-none transition ${
  dnaAnswerStatus === "correct"
    ? "border-green-500 bg-green-50"
    : dnaAnswerStatus === "wrong"
    ? "border-red-500 bg-red-50"
    : "border-gray-200 bg-white"
}`}

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitDNAAnswer();
                }
              }}
            />
{dnaSuggestionsOpen &&
  dnaAnswer.trim() !== "" &&
  !dnaFinished &&
  dnaTimeLeft !== 0 &&
  dnaPlayers
    .filter((player) =>
      player.name
        .toLocaleLowerCase("tr-TR")
        .includes(dnaAnswer.toLocaleLowerCase("tr-TR"))
    )
    .slice(0, 6)
    .map((player) => (
      <button
        key={player.id}
        type="button"
        onClick={() => {
          setDnaAnswer(player.name);
          setDnaSuggestionsOpen(false);
        }}
        className="w-full px-5 py-3 text-left bg-white text-gray-900 hover:bg-yellow-100 transition"
      >
        <span className="font-bold">{player.name}</span>
        {player.position && (
          <span className="ml-2 text-sm text-gray-500">
            {player.position}
          </span>
        )}
      </button>
    ))}
            <button
              onClick={submitDNAAnswer}
              disabled={dnaFinished || dnaTimeLeft === 0}
              className="w-full mt-4 rounded-2xl bg-yellow-500 px-5 py-4 font-black text-black transition hover:bg-yellow-400 disabled:bg-gray-300 disabled:text-gray-500"
            >
              TAHMİN ET
            </button>
          </div>

          {dnaMessage && (
            <div className="mt-5 rounded-2xl bg-gray-100 p-4 text-center font-bold text-gray-800">
              {dnaMessage}
            </div>
          )}

          {dnaFinished && (
           <div className="mt-6 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 p-6 text-center border border-yellow-200">
  <div className="text-5xl mb-3">
    🏆
  </div>

  <p className="text-sm font-black tracking-widest text-yellow-600">
    FUTBOL DNA
  </p>

  <h2 className="mt-2 text-3xl font-black text-gray-900">
    OYUN TAMAMLANDI!
  </h2>

  <p className="mt-2 text-gray-500">
    10 soruluk Futbol DNA testini tamamladın.
  </p>

  <div className="mt-6 grid grid-cols-2 gap-4">
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs font-bold text-gray-400">
        TOPLAM PUAN
      </p>

      <p className="mt-2 text-4xl font-black text-yellow-600">
        {dnaScore}
      </p>
    </div>

    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs font-bold text-gray-400">
        DOĞRU
      </p>

      <p className="mt-2 text-4xl font-black text-green-600">
        {dnaCorrectAnswers}/10
      </p>
    </div>
  </div>

  <div className="mt-4 rounded-2xl bg-white p-4">
    <p className="text-sm font-bold text-gray-400">
      BAŞARI
    </p>

    <p className="mt-1 text-2xl font-black text-gray-900">
      %{dnaCorrectAnswers * 10}
    </p>
  </div>

  <div className="flex gap-3 mt-6">
    <button
      onClick={() => {
  setDnaCurrentPlayer(null);
  setDnaDifficulty(null);
  setDnaCountdown(null);
  setDnaFinished(false);
  setSelectedMode("football-dna");
}}
      className="flex-1 rounded-2xl bg-yellow-500 px-5 py-3 font-black text-black hover:bg-yellow-400 transition"
    >
      YENİ OYUN 🔄
    </button>

    <button
      onClick={() => {
        setSelectedMode(null);
        setDnaCurrentPlayer(null);
        setDnaTimeLeft(15);
        setDnaAnswer("");
        setDnaScore(0);
        setDnaCorrectAnswers(0);
        setDnaQuestionNumber(0);
        setDnaFinished(false);
        setDnaMessage("");
        setDnaAnswerStatus("idle");
        setDnaTransition(false);
      }}
      className="flex-1 rounded-2xl bg-gray-800 px-5 py-3 font-black text-white hover:bg-gray-700 transition"
    >
      ANA MENÜ
    </button>
  </div>
</div>
          )}
        </div>
      </div>
    </div>
  );
}
if (selectedMode === "iki-forma" && twoFormaTime === null) {
  return (
    <div
  className="min-h-screen flex items-center justify-center bg-cover bg-center px-6"
  style={{
    backgroundImage:
      "linear-gradient(rgba(20,5,35,0.70), rgba(5,5,15,0.90)), url('https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=2400&q=85')",
  }}
>
      <div className="w-full max-w-3xl">
        <button
          onClick={() => setSelectedMode(null)}
          className="mb-8 text-gray-400 hover:text-white transition"
        >
          ← Geri
        </button>

        <div className="text-center mb-10">
          <div className="text-5xl mb-4">👕</div>

          <h1 className="text-4xl font-black text-white">
            İKİ FORMA
          </h1>

          <p className="text-gray-400 mt-3">
            Önce süreni seç.
            <br />
            Takımlar seçimden sonra gösterilecek.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <button
            onClick={() => startTwoForma(5)}
            className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-left hover:bg-red-500/20 transition"
          >
            <div className="text-4xl mb-4">⚡</div>
            <h2 className="text-2xl font-black text-white">5 SANİYE</h2>
            <p className="text-red-400 font-bold mt-2">EKSTREM</p>

            <div className="mt-5 text-sm text-gray-400">
              <p>1 cevap hakkı</p>
              <p className="mt-1">En yüksek risk</p>
            </div>
          </button>

          <button
            onClick={() => startTwoForma(10)}
            className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-6 text-left hover:bg-orange-500/20 transition"
          >
            <div className="text-4xl mb-4">🔥</div>
            <h2 className="text-2xl font-black text-white">10 SANİYE</h2>
            <p className="text-orange-400 font-bold mt-2">ZOR</p>

            <div className="mt-5 text-sm text-gray-400">
              <p>1 cevap hakkı</p>
              <p className="mt-1">Dengeli risk</p>
            </div>
          </button>

          <button
            onClick={() => startTwoForma(15)}
            className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-left hover:bg-green-500/20 transition"
          >
            <div className="text-4xl mb-4">🧠</div>
            <h2 className="text-2xl font-black text-white">15 SANİYE</h2>
            <p className="text-green-400 font-bold mt-2">NORMAL</p>

            <div className="mt-5 text-sm text-gray-400">
              <p>2 cevap hakkı</p>
              <p className="mt-1">Daha güvenli</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
if (selectedMode === "iki-forma" && twoFormaCountdown !== null) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(10,5,30,0.78), rgba(5,5,15,0.92)), url('https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=2400&q=85')",
      }}
    >
      <div className="text-center">
        <p className="text-white/70 text-lg mb-4">
          HAZIR OL
        </p>

        <div className="text-9xl font-black text-white">
          {twoFormaCountdown}
        </div>

        <p className="text-white/60 mt-6">
          Takımlar geliyor...
        </p>
      </div>
    </div>
  );
}
if (
  selectedMode === "iki-forma" &&
  twoFormaTime !== null &&
  twoFormaCountdown === null
) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(20,5,35,0.72), rgba(5,5,15,0.94)), url('https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=2400&q=85')",
      }}
    >
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <p className="text-purple-300 text-sm font-bold tracking-widest">
            İKİ FORMA
          </p>

          <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
            İKİ TAKIM, TEK OYUNCU
          </h1>

          <p className="text-white/60 mt-3">
            Bu iki takımda da oynamış futbolcuyu bul.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
            <div className="text-5xl mb-4">👕</div>

            <h2 className="text-2xl font-black text-gray-900">
              {twoFormaClubs[0]?.name}
            </h2>

            <p className="text-gray-500 mt-2">
              {twoFormaClubs[0]?.country}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
            <div className="text-5xl mb-4">👕</div>

            <h2 className="text-2xl font-black text-gray-900">
              {twoFormaClubs[1]?.name}
            </h2>

            <p className="text-gray-500 mt-2">
              {twoFormaClubs[1]?.country}
            </p>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-6">
          <div className="flex items-center justify-between text-white mb-4">
            <span className="font-bold">
              Kalan süre
            </span>

            <span className="text-3xl font-black">
              {twoFormaTimeLeft}
            </span>
          </div>

          <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-purple-500 transition-all duration-1000"
              style={{
                width: `${((twoFormaTimeLeft ?? 0) / twoFormaTime) * 100}%`,
              }}
            />
          </div>

          <div className="relative">
  <input
    type="text"
    value={twoFormaAnswer}
    onChange={(e) => {
  setTwoFormaAnswer(e.target.value);
  setTwoFormaSuggestionsOpen(true);
}}
    placeholder="Oyuncunun adını yaz..."
    className={`w-full px-5 py-4 rounded-2xl text-gray-900 text-lg outline-none transition-all duration-300 ${
  twoFormaAnswerStatus === "correct"
    ? "bg-green-100 border-4 border-green-500 shadow-[0_0_25px_rgba(34,197,94,0.7)]"
    : twoFormaAnswerStatus === "wrong"
    ? "bg-red-100 border-4 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.7)]"
    : "bg-white border-2 border-transparent"
}`}
    autoFocus
    disabled={twoFormaRoundFinished || twoFormaTimeLeft === 0}
  />

  {twoFormaSuggestionsOpen &&
  twoFormaAnswer.trim() !== "" &&
  !twoFormaRoundFinished &&
  twoFormaTimeLeft !== 0 &&
  getTwoFormaSuggestions(twoFormaAnswer).length > 0 && (
      <div className="w-full mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {getTwoFormaSuggestions(twoFormaAnswer).map((player) => (
          <button
            key={player.id}
            type="button"
            onClick={() => {
  setTwoFormaAnswer(player.name);
  setTwoFormaSuggestionsOpen(false);
}}
            className="w-full px-5 py-3 text-left text-gray-900 hover:bg-purple-100 transition"
          >
            <span className="font-bold">{player.name}</span>

            {player.position && (
              <span className="ml-2 text-sm text-gray-500">
                {player.position}
              </span>
            )}
          </button>
        ))}
      </div>
    )}
</div>

          <button
  onClick={submitTwoFormaAnswer}
  disabled={twoFormaRoundFinished || twoFormaTimeLeft === 0}
  className="w-full mt-4 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-black text-lg transition"
>
  CEVAPLA
</button>

          <div className="text-center mt-4 text-white/60">
            Hak: {twoFormaAttempts}
          </div>
          {twoFormaMessage && (
  <div
    className={`mt-5 rounded-2xl p-5 text-center border ${
      twoFormaAnswerStatus === "correct"
        ? "bg-green-500/10 border-green-400/30"
        : twoFormaAnswerStatus === "wrong"
        ? "bg-red-500/10 border-red-400/30"
        : "bg-white/5 border-white/10"
    }`}
  >
    <div
      className={`text-3xl mb-2 ${
        twoFormaAnswerStatus === "correct"
          ? "text-green-400"
          : twoFormaAnswerStatus === "wrong"
          ? "text-red-400"
          : "text-white"
      }`}
    >
      {twoFormaAnswerStatus === "correct"
        ? "✓"
        : twoFormaAnswerStatus === "wrong"
        ? "✕"
        : "!"}
    </div>

    <div
      className={`font-black text-xl ${
        twoFormaAnswerStatus === "correct"
          ? "text-green-400"
          : twoFormaAnswerStatus === "wrong"
          ? "text-red-400"
          : "text-white"
      }`}
    >
      {twoFormaMessage}
    </div>

    {twoFormaRoundFinished && (
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => {
            if (twoFormaTime !== null) {
              startTwoForma(twoFormaTime);
            }
          }}
          className="flex-1 rounded-xl bg-purple-600 px-5 py-3 font-bold text-white hover:bg-purple-500 transition"
        >
          YENİ TUR
        </button>

        <button
          onClick={() => {
            setSelectedMode(null);
            setTwoFormaTime(null);
            setTwoFormaTimeLeft(null);
            setTwoFormaCountdown(null);
            setTwoFormaClubs([]);
            setTwoFormaAnswer("");
            setTwoFormaAnswerStatus("idle");
            setTwoFormaAttempts(0);
            setTwoFormaScore(0);
            setTwoFormaMessage("");
            setTwoFormaRoundFinished(false);
            setGameStarted(false);
          }}
          className="flex-1 rounded-xl bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/20 transition"
        >
          ANA MENÜ
        </button>
      </div>
    )}
  </div>
)}
        </div>
      </div>
    </div>
  );
}
  if (!gameStarted && !selectedMode) {
    return (
    <main
  className="min-h-screen px-6 py-12 bg-cover bg-center bg-fixed"
  style={{
    backgroundImage:
      "linear-gradient(rgba(0,20,10,0.72), rgba(0,5,5,0.88)), url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=2400&q=85')",
  }}
>
      <div className="mx-auto max-w-5xl">

        {/* LOGO */}
        <div className="text-center text-white">
          <div className="text-7xl mb-5">
            ⚽
          </div>

          <h1 className="text-6xl font-black tracking-tight">
            RA<span className="text-green-400">BONA</span>
          </h1>

          <p className="mt-4 text-lg text-gray-300">
            Futbol bilgi arenasına hoş geldin.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Bir oyun modu seç ve futbol bilgini göster.
          </p>
        </div>

        {/* OYUN MODLARI */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">

          {/* KLASİK QUIZ */}
          <button
            onClick={() => {
              setSelectedMode("quiz");
              setQuizDifficulty(null);
            }}
            className="group rounded-3xl border border-white/10 bg-white/10 p-7 text-left text-white shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
          >
            <div className="flex items-start justify-between">
              <div className="text-5xl">🧠</div>

              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-300">
                OYNA
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-black">
              Klasik Quiz
            </h2>

            <p className="mt-2 text-gray-300">
              Zorlayıcı futbol sorularını cevapla, combo yap ve
              mümkün olduğunca yüksek puan topla.
            </p>

            <div className="mt-5 text-sm text-gray-400">
              ⚡ 15 saniye · 🎯 {questions.length} soru
            </div>
          </button>

          {/* İKİ FORMA */}
<button
  onClick={() => setSelectedMode("iki-forma")}
  className="group rounded-3xl border border-white/10 bg-white/10 p-7 text-left text-white shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
>
  <div className="flex items-start justify-between">
    <div className="text-5xl">🧩</div>

    <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300">
  OYNA
</span>
  </div>

  <h2 className="mt-6 text-2xl font-black">
    İki Forma
  </h2>

  <p className="mt-2 text-gray-300">
    İki kulüp verilecek. İkisinde de forma giymiş futbolcuyu bul.
  </p>

  <div className="mt-5 text-sm text-gray-400">
    🏟️ Kulüp · 👤 Oyuncu · ⏱️ Zamana karşı
  </div>
</button>
<button
  onClick={() => {
  setSelectedMode("football-dna");
  setDnaDifficulty(null);
}}
  className="group rounded-3xl border border-white/10 bg-white/10 p-7 text-left text-white shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
>
  <div className="flex items-start justify-between">
    <div className="text-5xl">🧬</div>

    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-300">
      OYNA
    </span>
  </div>

  <h2 className="mt-6 text-2xl font-black">
    Futbol DNA
  </h2>

  <p className="mt-2 text-gray-300">
    Verilen ipuçlarından futbolcuyu bul.
    Hafızanı ve futbol bilgisini test et.
  </p>

  <div className="mt-5 text-sm text-gray-400">
    🧠 Oyuncu · 🎯 Bilgi · ⚡ Hız
  </div>
</button>
          {/* FUTBOL HARİTASI */}
          <button
            onClick={() => setSelectedMode("football-map")}
            className="group rounded-3xl border border-white/10 bg-white/10 p-7 text-left text-white shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
          >
            <div className="flex items-start justify-between">
              <div className="text-5xl">🗺️</div>

              <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-300">
                YAKINDA
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-black">
              Futbol Haritası
            </h2>

            <p className="mt-2 text-gray-300">
              Futbolcuları kullanarak iki kulüp arasında bağlantı
              kurmaya çalış.
            </p>

            <div className="mt-5 text-sm text-gray-400">
              🔗 Bağlantı · 🧩 Strateji · ⚡ Hız
            </div>
          </button>

        </div>

        {/* ALT BİLGİ */}
        <div className="mt-10 text-center text-sm text-gray-500">
          Rabona sürekli gelişiyor. Yeni oyun modları çok yakında. 🚀
        </div>

      </div>
    </main>
  );
  }

  
  // OYUN BİTTİ
  if (finished) {
    const percentage = Math.round(
      (correctAnswers / questions.length) * 100
    );

    let message = "Biraz daha çalışmalısın!";

    if (percentage >= 50) {
      message = "Fena değil! ⚽";
    }

    if (percentage >= 70) {
      message = "Futbol bilgin gayet iyi! 🔥";
    }

    if (percentage >= 90) {
      message = "Sen gerçek bir futbol profesörüsün! 👑";
    }

    return (
      <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-800 to-black flex items-center justify-center px-6">

        <div className="w-full max-w-md rounded-3xl bg-white/10 p-10 text-center text-white shadow-2xl backdrop-blur-xl border border-white/10">

          <div className="text-7xl">
            🏆
          </div>

          <h1 className="mt-5 text-4xl font-black">
            QUIZ BİTTİ!
          </h1>

          <p className="mt-3 text-gray-300">
            {message}
          </p>

          <div className="mt-8 rounded-2xl bg-black/30 p-6">
            <p className="text-sm text-gray-400">
              TOPLAM PUAN
            </p>

            <p className="mt-2 text-5xl font-black text-green-400">
              {score}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-gray-400">
                DOĞRU
              </p>

              <p className="mt-1 text-2xl font-bold">
                {correctAnswers}/{questions.length}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-gray-400">
                BAŞARI
              </p>

              <p className="mt-1 text-2xl font-bold">
                %{percentage}
              </p>
            </div>

          </div>

          <button
            onClick={startGame}
            className="mt-8 w-full rounded-2xl bg-green-500 py-4 font-black transition hover:bg-green-400 hover:scale-105"
          >
            TEKRAR OYNA 🔄
          </button>

        </div>

      </main>
    );
  }

  const question = questions[currentQuestion];

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-800 to-black px-4 py-8">

      <div className="mx-auto max-w-2xl">

        {/* ÜST BİLGİ */}
        <div className="mb-6 flex items-center justify-between text-white">

          <div>
            <p className="text-sm text-gray-400">
              FUTBOL QUIZ
            </p>

            <p className="text-lg font-bold">
              Soru {currentQuestion + 1}
              <span className="text-gray-400">
                {" "}
                / {questions.length}
              </span>
            </p>
          </div>

          <div className="text-right">

            <p className="text-sm text-gray-400">
              PUAN
            </p>

            <p className="text-xl font-black text-green-400">
              {score}
            </p>

          </div>

        </div>

        {/* İLERLEME ÇUBUĞU */}
        <div className="mb-8 h-2 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-green-400 transition-all duration-500"
            style={{
              width: `${
                ((currentQuestion + 1) /
                  questions.length) *
                100
              }%`,
            }}
          />

        </div>

        {/* COMBO */}
        {combo >= 2 && (
          <div className="mb-5 text-center text-lg font-black text-yellow-400">
            🔥 {combo} COMBO!
          </div>
        )}

        {/* SORU KARTI */}
        <div className="rounded-3xl bg-white p-7 shadow-2xl md:p-10">

          {/* TIMER */}
          <div className="mb-8 flex items-center justify-center">

            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full border-8 ${
                timeLeft <= 5
                  ? "border-red-500 text-red-500"
                  : "border-green-500 text-green-600"
              }`}
            >
              <span className="text-2xl font-black">
                {timeLeft}
              </span>
            </div>

          </div>

          <p className="text-center text-sm font-bold uppercase tracking-wider text-gray-400">
            Futbol Bilgini Göster
          </p>

          <h1 className="mt-4 text-center text-2xl font-black leading-tight text-gray-900 md:text-3xl">
            {question.question}
          </h1>

          {/* CEVAPLAR */}
          <div className="mt-8 grid gap-4">

            {question.options.map((option, index) => {

              const isCorrect =
                option === question.answer;

              const isSelected =
                option === selectedAnswer;

              let buttonStyle =
                "border-gray-200 bg-gray-50 hover:border-green-500 hover:bg-green-50";

              if (selectedAnswer !== null) {

                if (isCorrect) {
                  buttonStyle =
                    "border-green-500 bg-green-100 text-green-800";
                }

                if (isSelected && !isCorrect) {
                  buttonStyle =
                    "border-red-500 bg-red-100 text-red-800";
                }

              }

              return (
                <button
                  key={option}
                  onClick={() =>
                    answerQuestion(option)
                  }
                  disabled={
                    selectedAnswer !== null
                  }
                  className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left font-bold transition ${buttonStyle}`}
                >

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span>
                    {option}
                  </span>

                  {selectedAnswer !== null &&
                    isCorrect && (
                      <span className="ml-auto text-xl">
                        ✓
                      </span>
                    )}

                  {isSelected &&
                    !isCorrect && (
                      <span className="ml-auto text-xl">
                        ✕
                      </span>
                    )}

                </button>
              );

            })}

          </div>

        </div>

        {/* ALT BİLGİ */}
        <div className="mt-6 flex justify-center gap-6 text-sm text-gray-400">
          <span>
            🎯 {correctAnswers} doğru
          </span>

          <span>
            🔥 {combo} seri
          </span>
        </div>

      </div>

    </main>
  );
}