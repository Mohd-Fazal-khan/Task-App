import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TaskItem from "./TaskItem";
import Colors from "../constants/Colors";

type TaskType = {
  id: string;
  title: string;
  createdAt: Date;
  dueDate: Date;
  tags: { text: string; color: string }[];
  isCompleted: boolean;
  priority?: "high" | "medium" | "low";
};

type Props = {
  title: string;
  tasks: TaskType[];
  onEdit: (task: TaskType) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (task: TaskType) => void;
};

const TaskListSection = ({ title, tasks, onEdit, onDelete, onToggleComplete }: Props) => {
  if (!tasks || tasks.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
          onToggleComplete={() => onToggleComplete(task)}
        />
      ))}
    </View>
  );
};

export default TaskListSection;

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textDark,
    marginBottom: 10,
  },
});
