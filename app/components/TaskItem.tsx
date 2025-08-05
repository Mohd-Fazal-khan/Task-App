import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TaskTag from "./TaskTag";
import Colors from "../constants/Colors";
import { format } from "date-fns";

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const swipeableRef = useRef<Swipeable>(null);
  const closeSwipe = () => swipeableRef.current?.close();

  const renderRightActions = () => (
    <View style={styles.swipeActionsContainer}>
      <TouchableOpacity
        style={[styles.swipeButton, styles.editButton]}
        onPress={() => {
          closeSwipe();
          onEdit();
        }}
      >
        <MaterialCommunityIcons
          name="pencil-outline"
          size={20}
          color={Colors.white}
        />
        <Text style={styles.swipeButtonText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.swipeButton, styles.completeButton]}
        onPress={() => {
          closeSwipe();
          onToggleComplete();
        }}
      >
        <MaterialCommunityIcons
          name={task.isCompleted ? "undo" : "check-circle-outline"}
          size={20}
          color={Colors.white}
        />
        <Text style={styles.swipeButtonText}>
          {task.isCompleted ? "Undo" : "Done"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.swipeButton, styles.deleteButton]}
        onPress={() => {
          closeSwipe();
          onDelete();
        }}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={20}
          color={Colors.white}
        />
        <Text style={styles.swipeButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions}>
      <View
        style={[styles.taskCard, task.isCompleted && styles.taskCardCompleted]}
      >
        <View style={styles.taskLeft}>
          <View
            style={[
              styles.taskCircle,
              task.isCompleted && styles.taskCircleCompleted,
            ]}
          >
            {!task.isCompleted && <View style={styles.taskCircleInner} />}
          </View>
          <View>
            <Text
              style={[
                styles.taskTitle,
                task.isCompleted && styles.taskTitleCompleted,
              ]}
            >
              {task.title}
            </Text>
            <Text
              style={[
                styles.taskDate,
                task.isCompleted && styles.taskDateCompleted,
              ]}
            >
              {task.createdAt instanceof Date && !isNaN(+task.createdAt)
                ? format(task.createdAt, "d MMM")
                : ""}
            </Text>
          </View>
        </View>
        <View style={styles.taskTags}>
          {task.tags.map((tag, idx) => (
            <TaskTag key={idx} text={tag.text} color={tag.color} />
          ))}
        </View>
      </View>
    </Swipeable>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  taskCardCompleted: {
    opacity: 0.6,
  },
  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  taskCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primaryPurple,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  taskCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryPurple,
  },
  taskCircleCompleted: {
    borderColor: Colors.greyedOut,
    backgroundColor: Colors.greyedOut,
  },
  taskTitle: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: "500",
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: Colors.greyedOut,
  },
  taskDate: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  taskDateCompleted: {
    color: Colors.greyedOut,
  },
  taskTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 10,
  },
  swipeActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
  },
  swipeButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    width: 80,
    height: 54,
    flexDirection: "column",
    marginHorizontal: 4,
    borderRadius: 15,
  },
  swipeButtonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 13,
    marginTop: 6,
  },
  editButton: {
    backgroundColor: Colors.lightgreen,
  },
  completeButton: {
    backgroundColor: Colors.lightblue,
  },
  deleteButton: {
    backgroundColor: Colors.google,
  },
});
