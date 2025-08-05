import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { db, auth } from "../../../firebase/config";
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import Colors from "../../constants/Colors";

const { width, height } = Dimensions.get("window");

export default function AddTaskScreen() {
  const navigation = useNavigation();
  const { task } = useLocalSearchParams();
  const taskToEdit = task ? JSON.parse(task) : null;

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("Medium");

  const priorityOptions = ["Low", "Medium", "High"];

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      if (taskToEdit.dueDate) {
        const dueDateObj =
          typeof taskToEdit.dueDate.toDate === "function"
            ? taskToEdit.dueDate.toDate()
            : new Date(taskToEdit.dueDate);
        setDueDate(dueDateObj);
      }
      setTags(
        Array.isArray(taskToEdit.tags)
          ? taskToEdit.tags.map((tag) => tag.text || tag).join(", ")
          : ""
      );
      setDescription(taskToEdit.description || "");
      setSelectedPriority(taskToEdit.priority || "Medium");
    }
  }, []);

  const handleSubmit = async () => {
    if (!title || !dueDate) {
      Alert.alert("Validation Error", "Please fill in Title and Due Date.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    const taskData = {
      title,
      dueDate: Timestamp.fromDate(dueDate),
      tags: tags.split(",").map((tag) => tag.trim()),
      priority: selectedPriority.toLowerCase(),
      description,
    };

    try {
      const userTasksCollection = collection(
        db,
        "users",
        currentUser.uid,
        "tasks"
      );

      if (taskToEdit && taskToEdit.id) {
        const taskDocRef = doc(userTasksCollection, taskToEdit.id);
        await updateDoc(taskDocRef, taskData);
        Alert.alert("Success", "Task updated successfully!");
      } else {
        await addDoc(userTasksCollection, {
          ...taskData,
          createdAt: Timestamp.now(),
          isCompleted: false,
        });
        Alert.alert("Success", "Task added successfully!");
      }

      
      setTitle("");
      setDueDate(null);
      setTags("");
      setDescription("");
      setSelectedPriority("Medium");

      navigation.goBack();
    } catch (error) {
      console.error("Error saving task: ", error);
      Alert.alert("Error", "Failed to save task.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {taskToEdit ? "Edit Task" : "Add New Task"}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Buy groceries"
          placeholderTextColor={Colors.textLight}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>
            {dueDate ? dueDate.toDateString() : "Select a date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDueDate(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Category Tags (comma-separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Personal, Home"
          placeholderTextColor={Colors.textLight}
          value={tags}
          onChangeText={setTags}
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityContainer}>
          {priorityOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.priorityOption,
                selectedPriority === option && styles.priorityOptionSelected,
              ]}
              onPress={() => setSelectedPriority(option)}
            >
              <Text
                style={[
                  styles.priorityOptionText,
                  selectedPriority === option &&
                    styles.priorityOptionTextSelected,
                ]}
                allowFontScaling={false}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add more details about the task"
          placeholderTextColor={Colors.textLight}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addButtonText}>
            {taskToEdit ? "Update Task" : "Add Task"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    backgroundColor: Colors.lightPurple,
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: Colors.white,
    paddingVertical: height * 0.03,
  },
  formContainer: {
    padding: width * 0.05,
    backgroundColor: Colors.cardBackground,
    margin: width * 0.05,
    borderRadius: 15,
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: Colors.textDark,
    marginBottom: 8,
    marginTop: height * 0.015,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    padding: width * 0.035,
    fontSize: width * 0.04,
    color: Colors.textDark,
    backgroundColor: Colors.white,
  },
  textArea: {
    height: height * 0.15,
    textAlignVertical: "top",
  },
  datePickerButton: {
    padding: width * 0.035,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  datePickerText: {
    fontSize: width * 0.04,
    color: Colors.textDark,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: height * 0.015,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.primaryPurple,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: "center",
  },
  priorityOptionSelected: {
    backgroundColor: Colors.primaryPurple,
  },
  priorityOptionText: {
    fontSize: width * 0.035,
    color: Colors.primaryPurple,
  },
  priorityOptionTextSelected: {
    color: Colors.white,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: Colors.buttonPrimary,
    borderRadius: 15,
    paddingVertical: height * 0.02,
    alignItems: "center",
    marginTop: height * 0.03,
  },
  addButtonText: {
    color: Colors.buttonText,
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});
