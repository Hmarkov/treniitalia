import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, Animated , FlatList, Dimensions } from 'react-native';
import { fetchTrains } from "../services/trainService";
import { Train } from "../types/interfaces";

const TrainList: React.FC=()=>{
     const [trains,setTrains]=useState<Train[]>([]);
     const [rowColors, setRowColors] = useState<Array<'yellow' | 'black'>>([]);

     const [animatedValue] = useState(new Animated.Value(0));

     useEffect(() => {
          const fetchData = async () => {
            const data = await fetchTrains();
            setTrains(data);
            if (rowColors.length === 0) {
               setRowColors(Array.from({ length: data.length }, (_, i) => (i % 2 === 0 ? 'yellow' : 'black')));
             }
            startAnimation();
          };
          fetchData();
          const interval = setInterval(fetchData, 60000);
          return () => clearInterval(interval);
        }, []);
      
        const startAnimation = () => {
          trains.forEach((_, index) => {
            setTimeout(() => {
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
              }).start(() => {
                setRowColors(prevColors => {
                  const newColors = [...prevColors];
                  newColors[index] = prevColors[index] === 'yellow' ? 'black' : 'yellow';
                  return newColors;
                });
              });
            }, index * 500);
          });
        };
      
        const renderItem = ({ item, index }: { item: Train; index: number }) => {
          const rowColor = rowColors[index]; // Get color from rowColors array
          let textStyle = rowColor === 'yellow' ? styles.blackText : styles.yellowText;
      
          const backgroundColorAnimation = animatedValue.interpolate({
               inputRange: [0, 1],
               outputRange: [rowColor === 'yellow' ? 'black' : 'yellow', rowColor === 'yellow' ? 'yellow' : 'black'],
             });
      
          // Check if the destination matches the specified string
          if (item.destination === "FIUMICINO AEROPORTO") {
            // If it matches, change the text color to red
            textStyle = { ...textStyle, color: 'red' };
          }
      
          return (
               <Animated.View style={[styles.dataRow, { backgroundColor: backgroundColorAnimation }]}>
              <Text style={[styles.dataText, textStyle, styles.columnText]}>{item.trainNumber}</Text>
              <Text style={[styles.dataText, textStyle, styles.columnText]}>{item.destination}</Text>
              <Text style={[styles.dataText, textStyle, styles.columnText]}>{item.departureTime}</Text>
              <Text style={[styles.dataText, textStyle, styles.columnText]}>{item.delay}</Text>
              <Text style={[styles.dataText, textStyle, styles.columnText]}>{item.platform}</Text>
            </Animated.View>
          );
        };
        
      
        return (
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <Text style={[styles.headerText, styles.columnText]}>Treno</Text>
              <Text style={[styles.headerText, styles.columnText]}>Destin.</Text>
              <Text style={[styles.headerText, styles.columnText]}>Orario</Text>
              <Text style={[styles.headerText, styles.columnText]}>Ritardo</Text>
              <Text style={[styles.headerText, styles.columnText]}>Binario</Text>
            </View>
            <FlatList
              data={trains}
              renderItem={({ item, index }) => renderItem({ item, index })}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        );
      };
      
      const styles = StyleSheet.create({
          container: {
               flex: 1,
               backgroundColor: 'green',
             },
          flatListContent: {
               flexGrow: 1
             },
             headerRow: {
               flexDirection: 'row',
               justifyContent: 'space-between',
               backgroundColor: 'yellow',
               borderBottomWidth: 1,
               borderBottomColor: '#000',
               paddingVertical: 10,
               marginBottom: 2,
               paddingHorizontal: 5,
               width: '100%',
             },
             headerText: {
               fontWeight: 'bold',
               color:'black',
               fontSize: 18,
             },
             dataRow: {
               flexDirection: 'row',
               justifyContent: 'space-between',
               paddingVertical: 10,
               marginBottom: 2,
               borderBottomWidth: 1,
               borderBottomColor: 'lightgray',
               backgroundColor: 'yellow',
               width: '100%',
             },
          dataText: {
            fontSize: 20,
            fontWeight: 'bold', 
          },
          columnText: {
            width: Dimensions.get('window').width * 0.2,
            paddingLeft: 10,
          },
          blackRow: {
            backgroundColor: 'black',
          },
          yellowRow: {
            backgroundColor: 'yellow',
          },
          yellowText: {
            color: 'yellow',
          },
          blackText: {
            color: 'black',
          },
        });

      
export default TrainList;