import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';


import AllTasksScreen from '../screens/home/AllTaskScreen';
import AddTaskScreen from '../screens/home/AddTaskScreen';
import CalendarViewScreen from '../screens/home/CalendarViewScreen';

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle:{
            height: 70,
        },
        tabBarLabelStyle:{
            marginTop:15
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'All Tasks') {
            iconName = 'format-list-checkbox';
          } else if (route.name === 'Add Task') {
            iconName = 'pencil-plus';
          } else if (route.name === 'Calendar View') {
            iconName = 'calendar-blank-outline';
          }

          return (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <MaterialCommunityIcons name={iconName} size={20} color={Colors.white} />
            </View>
          );
        },
        tabBarActiveTintColor: Colors.primaryPurple,
        tabBarInactiveTintColor: Colors.inputBorder,
      })}
    >
      <Tab.Screen name="All Tasks" component={AllTasksScreen} />
      <Tab.Screen name="Add Task" component={AddTaskScreen} />
      <Tab.Screen name="Calendar View" component={CalendarViewScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabs;

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: Colors.inputBorder,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:15,
  },
  activeIcon: {
    backgroundColor: Colors.primaryPurple, 
    transform: [{ scale: 1.3 }],
    marginBottom:20
  },
});
