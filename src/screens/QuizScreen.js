import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { HelpCircle, Coins, Award, RefreshCw, CheckCircle, XCircle } from "lucide-react-native";

export default function QuizScreen() {
  // 📚 ডামি প্রশ্ন ব্যাংক (পরবর্তীতে এখানে API এর ডাটা বসাতে পারবে)
  const quizData = [
    {
      id: 1,
      question: "What is the primary token used in MegaMinerApp?",
      options: ["Bitcoin", "Mega Coin", "Ethereum", "Dogecoin"],
      correctAnswer: "Mega Coin",
    },
    {
      id: 2,
      question: "How often can you claim your Daily Check-in reward?",
      options: ["Every 12 Hours", "Every 24 Hours", "Once a Week", "Every 48 Hours"],
      correctAnswer: "Every 24 Hours",
    },
    {
      id: 3,
      question: "Which technology is used to build this mobile app?",
      options: ["Flutter", "Swift", "React Native", "Kotlin"],
      correctAnswer: "React Native",
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);

  const currentQuestion = quizData[currentQuestionIndex];
  const COINS_PER_CORRECT_ANSWER = 20; // প্রতি সঠিক উত্তরে ২০ কয়েন

  // 🎯 অপশন সিলেক্ট করার ফাংশন
  const handleOptionSelect = (option) => {
    if (selectedOption !== null) return; // একবার সিলেক্ট করলে আর চেঞ্জ করা যাবে না
    
    setSelectedOption(option);
    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  // ➡️ পরের প্রশ্নে যাওয়ার ফাংশন
  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizEnded(true);
    }
  };

  // 🔄 কুইজ রিসেট/আবার খেলার ফাংশন
  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizEnded(false);
  };

  // 🎁 রিওয়ার্ড ক্লেইম করার বাটন
  const handleClaimCoins = () => {
    const totalWon = score * COINS_PER_CORRECT_ANSWER;
    Alert.alert("🎉 Reward Claimed!", `Successfully added +${totalWon} Coins to your account.`);
    handleResetQuiz();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {!quizEnded ? (
          // 📝 কুইজ রানিং অবস্থা
          <View style={{ width: "100%" }}>
            {/* প্রোগ্রেস ও স্কোর ট্র্যাকার */}
            <View style={styles.topTracker}>
              <Text style={styles.trackerText}>
                Question: <Text style={{ color: "#3b82f6" }}>{currentQuestionIndex + 1}/{quizData.length}</Text>
              </Text>
              <View style={styles.scoreBox}>
                <Coins color="#f59e0b" size={16} fill="#f59e0b" />
                <Text style={styles.scoreText}>Score: {score}</Text>
              </View>
            </View>

            {/* প্রশ্ন কার্ড */}
            <View style={styles.questionCard}>
              <HelpCircle color="#3b82f6" size={32} style={{ marginBottom: 12 }} />
              <Text style={styles.questionText}>{currentQuestion.question}</Text>
            </View>

            {/* অপশন লিস্ট */}
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const isWrong = isSelected && !isCorrect;

                // ডাইনামিক স্টাইলিং লজিক
                let optionStyle = styles.optionButton;
                let textStyle = styles.optionText;

                if (selectedOption !== null) {
                  if (isCorrect) {
                    optionStyle = [styles.optionButton, styles.correctOption];
                    textStyle = [styles.optionText, styles.correctOptionText];
                  } else if (isWrong) {
                    optionStyle = [styles.optionButton, styles.wrongOption];
                    textStyle = [styles.optionText, styles.wrongOptionText];
                  } else {
                    optionStyle = [styles.optionButton, styles.disabledOption];
                  }
                }

                return (
                  <TouchableOpacity
                    key={index}
                    style={optionStyle}
                    onPress={() => handleOptionSelect(option)}
                    disabled={selectedOption !== null}
                    activeOpacity={0.7}
                  >
                    <Text style={textStyle}>{option}</Text>
                    {selectedOption !== null && isCorrect && <CheckCircle color="#10b981" size={18} />}
                    {selectedOption !== null && isWrong && <XCircle color="#ef4444" size={18} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* নেক্সট বাটন */}
            {selectedOption !== null && (
              <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                <Text style={styles.nextButtonText}>
                  {currentQuestionIndex === quizData.length - 1 ? "Finish Quiz" : "Next Question"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          // 🏆 কুইজ শেষ, রেজাল্ট কার্ড
          <View style={styles.resultCard}>
            <Award color="#f59e0b" size={60} style={{ marginBottom: 15 }} />
            <Text style={styles.resultTitle}>Quiz Completed!</Text>
            <Text style={styles.resultSubtitle}>You answered {score} out of {quizData.length} questions correctly.</Text>
            
            {/* টোটাল রিওয়ার্ড বক্স */}
            <View style={styles.rewardBox}>
              <Coins color="#f59e0b" size={28} fill="#f59e0b" />
              <Text style={styles.rewardText}>+{score * COINS_PER_CORRECT_ANSWER} Coins</Text>
            </View>

            {/* ক্লেইম বাটন */}
            <TouchableOpacity style={styles.claimButton} onPress={handleClaimCoins}>
              <Text style={styles.claimButtonText}>Claim Rewards</Text>
            </TouchableOpacity>

            {/* আবার খেলুন বাটন */}
            <TouchableOpacity style={styles.retryButton} onPress={handleResetQuiz}>
              <RefreshCw color="#64748b" size={16} style={{ marginRight: 6 }} />
              <Text style={styles.retryButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    alignItems: "center",
  },
  topTracker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    marginBottom: 15,
  },
  trackerText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  scoreBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  scoreText: {
    color: "#f59e0b",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6,
  },
  questionCard: {
    backgroundColor: "#111827",
    width: "100%",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 25,
  },
  questionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
  },
  optionsContainer: {
    width: "100%",
  },
  optionButton: {
    backgroundColor: "#111827",
    width: "100%",
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#1e293b",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "600",
  },
  /* 🟢 সঠিক উত্তরের স্টাইল */
  correctOption: {
    backgroundColor: "#10b98115",
    borderColor: "#10b981",
  },
  correctOptionText: {
    color: "#10b981",
  },
  /* 🔴 ভুল উত্তরের স্টাইল */
  wrongOption: {
    backgroundColor: "#ef444415",
    borderColor: "#ef4444",
  },
  wrongOptionText: {
    color: "#ef4444",
  },
  disabledOption: {
    opacity: 0.5,
  },
  /* ➡️ নেক্সট বাটন */
  nextButton: {
    backgroundColor: "#3b82f6",
    width: "100%",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 25,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  /* 🏆 রেজাল্ট কার্ড স্টাইল */
  resultCard: {
    backgroundColor: "#111827",
    width: "100%",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e293b",
    marginTop: 40,
  },
  resultTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  resultSubtitle: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  rewardBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f59e0b10",
    borderWidth: 1,
    borderColor: "#f59e0b",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginVertical: 25,
  },
  rewardText: {
    color: "#f59e0b",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  claimButton: {
    backgroundColor: "#10b981",
    width: "100%",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  claimButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  retryButtonText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
  },
});