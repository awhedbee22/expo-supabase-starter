import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/supabase-provider";
import { Input } from "@/components/ui/input";

type Entry = {
  id: string;
  strain: string;
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

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching entries:", error);
    } else {
      setEntries(data as Entry[]);
    }
  };

  const filteredEntries = entries.filter((entry) =>
    entry.strain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-4">
        <Input
          placeholder="Search strains..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="mb-4"
        />
        <ScrollView className="flex-1">
          {filteredEntries.map((entry) => (
            <View key={entry.id} className="bg-card p-4 rounded-lg mb-4">
              <View className="flex-row justify-between">
                <Text className="font-bold text-lg">{entry.strain}</Text>
                <Text>{entry.type}</Text>
              </View>
              {entry.image && (
                <Image
                  source={{ uri: entry.image }}
                  className="w-full h-40 rounded-md my-2"
                />
              )}
              <View className="flex-row justify-between mt-2">
                <Text>High: {entry.high_rating}/5</Text>
                <Text>Flavor: {entry.flavor_rating}/5</Text>
              </View>
              <Text className="mt-2">{entry.date}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View className="absolute bottom-4 right-4">
        <Button
          onPress={() => router.push("/add-entry")}
          className="w-16 h-16 rounded-full"
        >
          <Text className="text-2xl">+</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}