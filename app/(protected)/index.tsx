import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { View, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/supabase-provider";
import { SearchBox } from "@/components/SearchBox";

type Entry = {
  id: string;
  strain: string;
  brand: string;
  type: string;
  high_rating: number;
  flavor_rating: number;
  date: string;
  image: string | null;
};

export default function JournalPage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const fetchEntries = useCallback(async () => {
    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching entries:", error);
    } else {
      setEntries(data as Entry[]);
    }
  }, [supabase]);

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [fetchEntries])
  );

  const filteredEntries = entries.filter((entry) =>
    entry.strain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-4">
        <SearchBox
          value={searchQuery}
          onChangeText={setSearchQuery}
		  />
        <ScrollView className="flex-1">
          {filteredEntries.map((entry) => (
            <View key={entry.id} className="bg-card p-4 rounded-lg mb-4">
              <View className="flex-row justify-between">
                <Text className="font-bold text-lg">{entry.strain}</Text>
                <Text>{entry.type}</Text>
              </View>
              {entry.brand && (
                <Text className="text-twine-700 mt-1">{entry.brand}</Text>
              )}
              {entry.image && (
                <Image
                  source={{ uri: entry.image }}
                  className="w-full h-40 rounded-md my-2"
                />
              )}
              <View className="flex-row justify-between mt-2">	
                <Text className="text-twine-800">{`High Rating: ${entry.high_rating.toFixed(1)}/10`}</Text>
                <Text className="text-twine-800">{`Flavor Rating: ${entry.flavor_rating.toFixed(1)}/10`}</Text>
              </View>
              <Text className="mt-2">{new Date(entry.date).toLocaleDateString()}</Text>
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