
/* 
initialValues = {
    unitType,
    status: 0,// 0 = Not start yet, 1 = paused, 2 = Running...
    hourPrice: unitType === 'pc' ? pricesList : pricesList.single,
    duration: 0,
    durationWork: false,
    startTime: '00:00',
    mode: unitType === 'pc' ? 'pc' : 'single',// [single & Multi] for PS; [pc] for pc 
    orders: [
        {name: 'Can', price: 10, count: 3},
        {name: 'Indomy', price: 7, count: 2}
    ]
}
*/
export default function reducer(state, action) {
    switch (action.type) {
        case 'UNIT_START': {
            let date = new Date();
            let hours = date.getHours()
            let hoursBy12 = hours > 12 ? hours - 12 : hours ;
            let minutes = date.getMinutes()
            let startTime = `${hoursBy12 < 10 ? '0' + hoursBy12 : hoursBy12}:${minutes < 10 ? '0' + minutes : minutes}`;
            return {
                ...state,
                startTime,
                status: 2,
                durationWork: true
            }
        }
        case 'UNIT_PAUSED': {
            return {
                ...state, 
                status: 1,
                durationWork: false
            }
        }
        case 'UNIT_RESUME': {
            return {
                ...state,
                status: 2,
                durationWork: true
            }
        }
        case 'UNIT_END': {
            return {
                ...state, 
                status: 0,
                durationWork: false,
                duration: 0,
                startTime: '00:00',
                orders: state.orders.map(item => ({...item, count: 0}))
            }
        }
        case 'UNIT_PLAY_TIME': {
            return {...state, durationWork: true}
        }
        case 'UNIT_STOP_TIME': {
            return {...state, durationWork: false}
        }
        case 'INCREMENT_TIME': {
            return {...state, duration: state.duration + 1}
        }
        case 'CHANGE_UNIT_MODE': {
            return {
                ...state,
                mode: action.value,
                hourPrice: action.newPrice
            }
        }
        case 'ADD_ORDER':
            return {
                ...state,
                orders: state.orders.map(item => item.uid === action.payload.uid ? action.payload : item)
            }
        default: 
            return state;
    }
}