import { useState } from "react";
import { Text, ScrollView, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons"
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";

const availableWeekDays = 
["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function New() {
    const [title, setTitle] = useState('')
    const [weekDays, setWeekDays] = useState<number[]>([]);

    function handleToggleWeekDay(weekDayIndex: number){
        if(weekDays.includes(weekDayIndex)){
            setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex));
        } else {
            setWeekDays(prevState => [...prevState, weekDayIndex]);
        }
    }

    async function handleCreateNewHabit() {
        try {
            if(!title.trim() || weekDays.length === 0) {
                Alert.alert('New Habit', 'Please type a Habit name and how often.')
            }

            await api.post('/habits', { title, weekDays });

            setTitle('');
            setWeekDays([]);

            Alert.alert('New Habit!', 'New Habit added with success!')
        } catch (error) {
            console.log(error)
            Alert.alert("Ops!", "New Habit can't be created.")
        }
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >

                <BackButton />

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Create New Habit
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    What is your commitment?
                </Text>

                <TextInput
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                    placeholder="sample: sleep 8h, workout, read..."
                    placeholderTextColor={colors.zinc[400]}
                    onChangeText={setTitle}
                    value={title}
                />

                <Text className="font-semibold mt-4 mb-3 text-white text-base">
                    How often?
                </Text>

                {
                    availableWeekDays.map((weekDay, index) => (
                        <Checkbox 
                            key={weekDay}
                            title={weekDay}
                            checked={weekDays.includes(index)}
                            onPress={() => handleToggleWeekDay(index)}
                        />
                    ))
                }

                <TouchableOpacity
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                    activeOpacity={0.7}
                    onPress={handleCreateNewHabit}
                >
                    <Feather 
                        name="check"
                        size={20}
                        color={colors.white}
                    />
                    <Text className="font-semibold text-base text-white ml-2">
                        Done
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}