import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../../firebase/config";
import Colors from "../../constants/Colors";
import TaskItem from "../../components/TaskItem";
import {
  startOfDay,
  endOfDay,
  format,
  isSameDay,
} from "date-fns";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { formatTags } from "../../utils/formatTags";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");


const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

export default function CalendarViewScreen() {
  const currentDate = new Date();
  const today = currentDate.getDate();
  const currentMonth =
    currentDate.toLocaleString("default", {
      month: "long",
    }) + ` ${currentDate.getFullYear()}`;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchTasksForSelectedDate(selectedDate);
  }, [selectedDate]);

  const fetchTasksForSelectedDate = async (date) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const start = startOfDay(date);
      const end = endOfDay(date);

      const q = query(
        collection(db, "users", user.uid, "tasks"),
        where("dueDate", ">=", start),
        where("dueDate", "<=", end)
      );

      const snapshot = await getDocs(q);

      const tasksData = snapshot.docs.map((doc) => {
        const data = doc.data();
        const dueDate =
          data.dueDate?.toDate?.() || data.dueDate || new Date();

        return {
          id: doc.id,
          title: data.title || "",
          dueDate,
          isCompleted: data.isCompleted || false,
          tags: formatTags(data.tags),
          priority: data.priority || "medium",
          description: data.description || "",
        };
      });

      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const handleDayPress = (day) => {
    const selected = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(selected);
  };

  const handleDelete = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "users", user.uid, "tasks", id));
            fetchTasksForSelectedDate(selectedDate);
          } catch (error) {
            Alert.alert("Delete Failed", error.message);
          }
        },
      },
    ]);
  };

  const handleToggleComplete = async (task) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid, "tasks", task.id), {
        isCompleted: !task.isCompleted,
      });
      fetchTasksForSelectedDate(selectedDate);
    } catch (error) {
      Alert.alert("Update Failed", error.message);
    }
  };

  const handleEdit = (task) => {
    router.push({
      pathname: "/screens/home/AddTaskScreen",
      params: { task: JSON.stringify(task) },
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendar View</Text>
          <Text style={styles.monthText}>{currentMonth}</Text>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.daysOfWeekRow}>
            {daysOfWeek.map((day, index) => (
              <Text key={index} style={styles.dayOfWeekText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {Array.from({ length: 3 }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.dayCell} />
            ))}

            {daysInMonth.map((day) => {
              const isToday = day === today;
              const isSelected = isSameDay(
                selectedDate,
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
              );

              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => handleDayPress(day)}
                  style={[styles.dayCell, isSelected && styles.selectedDayCell]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.selectedDayText,
                      day > today && styles.disabledDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.taskSection}>
          <Text style={styles.taskHeader}>
            Tasks on{" "}
            {selectedDate instanceof Date && !isNaN(+selectedDate)
              ? format(selectedDate, "dd MMM yyyy")
              : "Invalid Date"}
          </Text>

          {tasks.length === 0 ? (
            <Text style={styles.noTaskText}>No tasks on this day</Text>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={() => handleDelete(task.id)}
                onEdit={() => handleEdit(task)}
                onToggleComplete={() => handleToggleComplete(task)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    backgroundColor: Colors.lightPurple,
    padding: width * 0.05,
    paddingBottom: height * 0.05,
    borderBottomLeftRadius: width * 0.08,
    borderBottomRightRadius: width * 0.08,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: Colors.white,
    marginTop: height * 0.02,
  },
  monthText: {
    fontSize: width * 0.045,
    color: Colors.white,
    marginTop: height * 0.005,
  },
  calendarContainer: {
    backgroundColor: Colors.cardBackground,
    margin: width * 0.05,
    borderRadius: width * 0.04,
    padding: width * 0.04,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2.22,
  },
  daysOfWeekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: height * 0.01,
  },
  dayOfWeekText: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: Colors.textDark,
    width: "14%",
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  dayCell: {
    width: "14%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: height * 0.007,
  },
  dayText: {
    fontSize: width * 0.04,
    color: Colors.dayText,
  },
  selectedDayCell: {
    backgroundColor: Colors.daySelected,
    borderRadius: width * 0.1,
  },
  selectedDayText: {
    color: Colors.dayTextSelected,
    fontWeight: "bold",
  },
  disabledDayText: {
    color: Colors.dayTextDisabled,
  },
  taskSection: {
    marginHorizontal: width * 0.05,
    marginTop: height * 0.01,
  },
  taskHeader: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: height * 0.015,
    color: Colors.textDark,
  },
  noTaskText: {
    fontSize: width * 0.04,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: height * 0.015,
  },
});
