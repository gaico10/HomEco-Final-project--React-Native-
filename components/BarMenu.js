import { StyleSheet, Text, View, Pressable } from 'react-native'
import React ,{useState} from 'react'
import HomeScreen from '../screens/HomeScreen'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'

const size = 20

const BarMenu = ({onPress, scrollHandler, index}) => {
    const [checked, setChecked] = useState(index ? index : 0);
  return (
    <View style={ styles.container }>
        <TouchableOpacity style={{alignItems:'center'}} onPress={() => {onPress(0); scrollHandler(); setChecked(0)}} activeOpacity={0.4}  pressMagnification={10}
            rippleColor= "rgba(0, 0, 0, .32)"
        >
            <View style={[styles.IconBehave,{backgroundColor:checked === 0 ? "white" :"#0779ef"}]} >
                <Icon 
                    name='home-export-outline'
                    color={checked === 0? "#0779ef" : "white"}
                    size={size}
                />
            </View>
            <Text style={{fontSize:10, color: "white" }}>Expenditures</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{alignItems:'center'}} onPress={() => {onPress(1); scrollHandler(); setChecked(1)}} activeOpacity={0.4}  pressMagnification={10}
            rippleColor= "rgba(0, 0, 0, .32)"
        >
            <View style={[styles.IconBehave,{backgroundColor:checked === 1 ? "white" :"#0779ef"}]} >
                <Icon 
                    name='home-import-outline'
                    color={checked === 1? "#0779ef" : "white"}
                    size={size}
                />
            </View>
            <Text style={{fontSize:10, color: "white" }}>Incomes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems:'center'}} onPress={() => {onPress(2); scrollHandler(); setChecked(2)}}  activeOpacity={0.4}  pressMagnification={10}
            rippleColor= "rgba(0, 0, 0, .32)"
        >
            <View style={[styles.IconBehave,{backgroundColor:checked === 2 ? "white" :"#0779ef"}]} >
                <Icon 
                    name='chart-bar'
                    color={checked === 2? "#0779ef" : "white"}
                    size={size}
                />
            </View>
            <Text style={{fontSize:10, color: "white" }}>Graphs</Text>
        </TouchableOpacity>

        <TouchableOpacity  style={{alignItems:'center'}} onPress={() => {onPress(3); scrollHandler(); setChecked(3)}} activeOpacity={0.4}  pressMagnification={10}
            rippleColor= "rgba(0, 0, 0, .32)"
        >
            <View style={[styles.IconBehave,{backgroundColor:checked === 3 ? "white" :"#0779ef"}]} >
                <Icon 
                    name='cart-outline'
                    color={checked === 3? "#0779ef" : "white"}
                    size={size}
                />
            </View>
            <Text style={{fontSize:10, color: "white" }}>Shopping List</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{alignItems:'center'}} onPress={() => {onPress(4); scrollHandler(); setChecked(4)}} activeOpacity={0.4}  pressMagnification={10}
            rippleColor= "rgba(0, 0, 0, .32)"
        >
            <View style={[styles.IconBehave,{backgroundColor:checked === 4 ? "white" :"#0779ef"}]} >
                <Icon 
                    name='format-list-checks'
                    color={checked === 4? "#0779ef" : "white"}
                    size={size}
                />
            </View>
            <Text style={{fontSize:10, color: "white" }}>Todo List</Text>
        </TouchableOpacity>
    </View>
  )
}

export default BarMenu

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#0779ef",
        width:"90%",
        alignSelf:'center',
        alignItems:'center',
        bottom:20,
        justifyContent:'space-evenly',
        flexDirection:'row',
        borderRadius:10,
        height:70
    },
    IconBehave:{
        padding:12,
        borderRadius:50,
    },
    IconWrpper:{
        alignItems:'center',
    }
})