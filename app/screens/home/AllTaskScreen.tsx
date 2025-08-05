import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { isToday, isTomorrow, isThisWeek, format } from "date-fns";
import { useFocusEffect, useRouter } from "expo-router";
import { db, auth } from "../../../firebase/config";
import Colors from "../../constants/Colors";

import TaskItem from "../../components/TaskItem";
import FilterModal from "../../components/FilterModal";
import { formatTags } from "../../utils/formatTags";
// import { Dimensions } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

export default function ListTaskScreen() {
  const [searchText, setSearchText] = useState("");
  const [todayTasks, setTodayTasks] = useState([]);
  const [tomorrowTasks, setTomorrowTasks] = useState([]);
  const [thisWeekTasks, setThisWeekTasks] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");


  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );
  const fetchTasks = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn("User not logged in");
      return;
    }

    const userId = currentUser.uid;
    try {
      const q = query(
        collection(db, "users", userId, "tasks"),
        orderBy("createdAt")
      );
      const snapshot = await getDocs(q);
      const tasks = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || "",
          createdAt: data.createdAt?.toDate?.() || new Date(),
          dueDate: data.dueDate?.toDate?.() || new Date(),
          tags: formatTags(data.tags),
          isCompleted: data.isCompleted || false,
          priority: data.priority || "medium",
        };
      });

      const today = [],
        tomorrow = [],
        week = [];

      tasks.forEach((task) => {
        if (isToday(task.dueDate)) today.push(task);
        else if (isTomorrow(task.dueDate)) tomorrow.push(task);
        else if (isThisWeek(task.dueDate)) week.push(task);
      });

      setTodayTasks(today);
      setTomorrowTasks(tomorrow);
      setThisWeekTasks(week);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleDelete = async (id) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "tasks", id));
      fetchTasks();
    } catch (error) {
      Alert.alert("Delete Failed", error.message);
    }
  };

  const handleToggleComplete = async (task) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "users", currentUser.uid, "tasks", task.id), {
        isCompleted: !task.isCompleted,
      });
      fetchTasks();
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

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await auth.signOut();
            await AsyncStorage.removeItem("user");
    
            router.replace("/screens/auth/LoginScreen");
          } catch (error) {
            Alert.alert("Logout Failed", error.message);
          }
        },
      },
    ]);
  };

  const filterTasks = (tasks) =>
    tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "completed" && task.isCompleted) ||
        (filterStatus === "incomplete" && !task.isCompleted);
      const matchesPriority =
        filterPriority === "all" ||
        filterPriority === task.priority?.toLowerCase();
      return matchesSearch && matchesStatus && matchesPriority;
    });

  const filteredToday = filterTasks(todayTasks);
  const filteredTomorrow = filterTasks(tomorrowTasks);
  const filteredThisWeek = filterTasks(thisWeekTasks);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="filter-variant"
                size={24}
                color={Colors.white}
              />
            </TouchableOpacity>
            <View style={styles.searchBar}>
              <Text style={styles.searchText}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor={Colors.textLight}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
              <MaterialCommunityIcons
                name="logout"
                size={24}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerDate}>
            Today, {format(new Date(), "d MMMM")}
          </Text>
          <Text style={styles.headerTitle}>My tasks</Text>
        </View>

        <ScrollView contentContainerStyle={styles.taskList}>
          {(filterStatus !== "all" || filterPriority !== "all") && (
            <View style={styles.activeFiltersRowOutside}>
              <Text style={styles.activeFilterText}>
                Showing:
                {filterStatus !== "all" &&
                  ` ${
                    filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)
                  }`}
                {filterPriority !== "all" &&
                  ` · ${
                    filterPriority.charAt(0).toUpperCase() +
                    filterPriority.slice(1)
                  } Priority`}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setFilterStatus("all");
                  setFilterPriority("all");
                }}
              >
                <Text style={styles.clearFilterText}>✕ Clear</Text>
              </TouchableOpacity>
            </View>
          )}

          {filteredToday.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Today</Text>
              {filteredToday.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={() => handleDelete(task.id)}
                  onEdit={() => handleEdit(task)}
                  onToggleComplete={() => handleToggleComplete(task)}
                />
              ))}
            </View>
          )}

          {filteredTomorrow.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Tomorrow</Text>
              {filteredTomorrow.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={() => handleDelete(task.id)}
                  onEdit={() => handleEdit(task)}
                  onToggleComplete={() => handleToggleComplete(task)}
                />
              ))}
            </View>
          )}

          {filteredThisWeek.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>This Week</Text>
              {filteredThisWeek.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={() => handleDelete(task.id)}
                  onEdit={() => handleEdit(task)}
                  onToggleComplete={() => handleToggleComplete(task)}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {filterModalVisible && (
          <FilterModal
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            onClose={() => setFilterModalVisible(false)}
          />
        )}
      </View>
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
    borderBottomLeftRadius: width * 0.07,
    borderBottomRightRadius: width * 0.07,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
     paddingVertical: height * 0.03,
  },
  iconButton: {
    padding: width * 0.015,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: width * 0.07,
    flex: 1,
    marginHorizontal: width * 0.02,
    paddingHorizontal: width * 0.04,
    height: height * 0.06,
  },
  searchText: {
    fontSize: width * 0.045,
    color: Colors.textLight,
    marginRight: width * 0.02,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.045,
    color: Colors.textDark,
  },
  headerDate: {
    fontSize: width * 0.04,
    color: Colors.white,
    marginBottom: height * 0.005,
  },
  headerTitle: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: Colors.white,
  },
  taskList: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.025,
    paddingBottom: height * 0.05,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: Colors.textDark,
    marginTop: height * 0.02,
    marginBottom: height * 0.015,
  },
  activeFiltersRowOutside: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.015,
    marginTop: -height * 0.01,
    backgroundColor: Colors.lightPurple,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.03,
  },
  activeFilterText: {
    fontSize: width * 0.035,
    color: Colors.white,
  },
  clearFilterText: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: Colors.white,
    marginLeft: width * 0.03,
  },
});
