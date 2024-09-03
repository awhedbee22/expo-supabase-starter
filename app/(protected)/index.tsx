import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { View, ScrollView, Alert, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/supabase-provider";
import { SearchBox } from "@/components/SearchBox";
import { StrainCard } from "@/components/StrainCard";
import { StrainDetail } from "@/components/StrainDetail";
import { Header } from "@/components/Header";

type Entry = {
  id: string;
  strain: string | null;
  brand: string | null;
  type: string;
  high_rating: number;
  flavor_rating: number;
  date: string;
  image: string | null;
};

export default function JournalPage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    const cachedEntries = await AsyncStorage.getItem('entries');
    if (cachedEntries) {
      setEntries(JSON.parse(cachedEntries));
    }

    // Fetch the latest data from Supabase
    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching entries:", error);
    } else {
      setEntries(data as Entry[]);
      // Update cache
      await AsyncStorage.setItem('entries', JSON.stringify(data));
    }
  }, [supabase]);

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [fetchEntries])
  );

  const filteredEntries = entries.filter((entry) =>
    (entry.strain?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (entry.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const handleCardPress = (entryId: string) => {
    setSelectedEntryId(entryId);
  };

  const handleCloseModal = () => {
    setSelectedEntryId(null);
  };

  const handleOptionsPress = (entry: Entry) => {
    Alert.alert(
      "Options",
      "Choose an action",
      [
        {
          text: "Edit",
          onPress: () => {
            console.log("Editing entry:", entry);
            router.push({
              pathname: "/add-entry",
              params: { entryData: JSON.stringify(entry) }
            });
          }
        },
        {
          text: "Delete",
          onPress: () => {
            Alert.alert("Delete", "Are you sure you want to delete this entry?", [
              {
                text: "Cancel",
                style: "cancel"
              },
              {
                text: "Delete",
                onPress: async () => {
                  const { error } = await supabase
                    .from("entries")
                    .delete()
                    .eq("id", entry.id);
                  
                  if (error) {
                    console.error("Error deleting entry:", error);
                    Alert.alert("Error", "Failed to delete entry");
                  } else {
                    fetchEntries();
                  }
                }
              }
            ]);
          },
          style: "destructive"
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-twine-300">
      <View className="flex-1 px-4 pt-2">
        <SearchBox
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="bg-twine-200"
        />
        <ScrollView className="flex-1">
          {filteredEntries.map((entry) => (
            <StrainCard
              key={entry.id}
              strain={entry.strain ?? "Unknown Strain"}
              brand={entry.brand ?? "Unknown Brand"}
              type={entry.type}
              highRating={entry.high_rating}
              flavorRating={entry.flavor_rating}
              image={entry.image}
              onPress={() => handleCardPress(entry.id)}
              onOptionsPress={() => handleOptionsPress(entry)}
            />
          ))}
        </ScrollView>
      </View>
      <View className="absolute bottom-10 right-10">
        <Button
          onPress={() => router.push("/add-entry")}
          className="p-10 rounded-full bg-twine-700 shadow-xl"
        >
          <Text className="text-9xl text-white font-bold">+</Text>
        </Button>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedEntryId}
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 bg-twine-300 mt-16">
          {selectedEntryId && <StrainDetail entryId={selectedEntryId} onClose={handleCloseModal} />}
        </View>
      </Modal>
    </View>
  );
}