import React from 'react';
import { Col, Row, Button, Select, Layout, Modal, message } from 'antd';
import { DollarCircleOutlined, FieldTimeOutlined, HourglassOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { FaRegLightbulb } from 'react-icons/fa';
import { MdMode } from 'react-icons/md';
import { ReactComponent as PCSVG} from '../assets/PC.svg';
import { ReactComponent as PS4} from '../assets/console-with-gamepad.svg';
import { ReactComponent as PS5} from '../assets/playstation-5.svg';
import { useState } from 'react';
import { setOrdersOnEndUint } from '../redux/marketSlice'
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as NoData } from '../assets/no-market.svg'


function DrawerContent({ unitState, unitDispatcher, unitType, unitName, setOpen }) {
    
    const colors = useSelector(state => state.theme.colors);
    const unitsSettings = useSelector(state => state.units);
    
    const [isOpen, setIsOpen] = useState(false)
    const [isEndOpen, setIsEndOpen] = useState(false)
    
    const iconSize = 2
    const rowsStyle = {marginBottom: 7}
    const colsStyle = {fontSize: 16, fontWeight: 'bold'}

    function getOrdersTotal() {
        let { orders } = unitState;
        let total = orders.map(item => item.price * item.count)
        let final = 0;
        total.forEach(item => final+=item)
        return final;
    }

    function getDuration() {
        let totalSeconds = unitState.duration;
        let hours = Math.floor( totalSeconds / (60 * 60) )
        let minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
        let seconds = ((totalSeconds % (60 * 60)) % 60)
        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    function getTimeCost() {
        let timeByHour = (unitState.duration / 60) / 60;
        let cost = `${timeByHour * unitState.hourPrice}`;
        let i = cost.indexOf('.')
        return Number( cost.slice(0, i + 3) );
    }

    return (
        <Layout style={{background: 'transparent'}}>
            <Row style={rowsStyle}>
                <Col style={colsStyle} span={iconSize}>
                    <DollarCircleOutlined />
                </Col>
                <Col style={colsStyle} span={24 - iconSize}>
                    Hour Price: <span style={{color: colors.main}}>{unitState.hourPrice}$</span>
                </Col>
            </Row>
            <Row style={rowsStyle}>
                <Col style={colsStyle} span={iconSize}>
                <FieldTimeOutlined />
                </Col>
                <Col style={colsStyle} span={24 - iconSize}>
                Start Time: <span style={{color: '#FF6CA8'}}>{unitState.startTime}</span>
                </Col>
            </Row>
            <Row style={rowsStyle}>
                <Col style={{...colsStyle, display: 'flex', alignItems: 'center'}} span={iconSize}>
                    <FaRegLightbulb />
                </Col>
                <Col style={colsStyle} span={24 - iconSize}>
                    Status: <span style={{color: unitState.status === 0 ? '#ff6666' :
                        unitState.status === 1 ? '#FFCF4B' :
                        unitState.status === 2 ? '#40e2a0' : 'red'}}>{
                            unitState.status === 0 ? 'Not Work' :
                            unitState.status === 1 ? 'Paused' :
                            unitState.status === 2 ? 'Running...' : 'Unknown Status'
                        }</span>
                </Col>
            </Row>
            <Row style={rowsStyle}>
                <Col style={colsStyle} span={iconSize}>
                <HourglassOutlined /> 
                </Col>
                <Col style={colsStyle} span={24 - iconSize}>
                    Duration: <span style={{color: '#9dcce0'}}>{getDuration()}</span>
                </Col>
            </Row>
            {
                unitState.mode !== 'pc' && <Row style={rowsStyle}>
                    <Col style={{...colsStyle, display: 'flex', alignItems: 'center'}} span={iconSize}>
                        <MdMode /> 
                    </Col>
                    <Col style={colsStyle} span={24 - iconSize}>
                        <Select 
                        size='small'
                        options={[
                            {value: 'single', label: 'Single Player'},
                            {value: 'multi', label: 'Multi Player'}
                        ]} 
                        value={unitState.mode} 
                        onChange={value => unitDispatcher({
                            value,
                            type: 'CHANGE_UNIT_MODE',
                            newPrice: value === 'single' ? unitsSettings[unitType].singlePrice : unitsSettings[unitType].multiPrice 
                            })} />
                    </Col>
            </Row>
            }
            {/* 
                --leg1: #80CBC4;
    --leg2: #4DB6AC;
    --leg3: #00897B; */}
            <Row style={{...rowsStyle, marginTop: 12, color: colors.main}}>
                <Col style={colsStyle} span={iconSize}>
                    <ShoppingCartOutlined />
                </Col>
                <Col style={colsStyle} span={24 - iconSize}>
                    Orders: {getOrdersTotal()}$
                </Col>
            </Row>
            <Row style={{...rowsStyle, color: colors.main}}>
                <Col style={colsStyle} span={iconSize}>
                    <FieldTimeOutlined />
                </Col>
                <Col style={colsStyle} span={24 - iconSize}>
                    Time Cost: {getTimeCost()}$
                </Col>
            </Row>
            <Row style={{...rowsStyle, color: colors.main}}>
                <Col style={colsStyle} span={iconSize}>
                    <DollarCircleOutlined />
                </Col>
                <Col style={colsStyle} span={24 - iconSize}>
                    Total Cost: {getOrdersTotal() + getTimeCost()}$
                </Col>
            </Row>
            <Row style={{marginTop: 20}}>
                {
                    unitState.status === 0 ? <Button  onClick={() => unitDispatcher({type: 'UNIT_START'})} type="primary">Start</Button> :
                    unitState.status === 1 ? <><Button  onClick={() => unitDispatcher({type: 'UNIT_RESUME'})} style={{marginRight: 15}} type="primary">Resume</Button><Button  onClick={() => setIsEndOpen(true)} style={{background: 'transparent'}} danger>End</Button></> :
                    unitState.status === 2 ? <><Button  onClick={() => unitDispatcher({type: 'UNIT_PAUSED'})} style={{marginRight: 15}}>Stop</Button><Button  type="primary" onClick={() => setIsOpen(true)} style={{marginRight: 15}}>Order</Button><Button  onClick={() => setIsEndOpen(true)} style={{background: 'transparent'}} danger>End</Button></> : "Unknown Status"
                }
            </Row>
            <MarketItems unitState={unitState} unitDispatcher={unitDispatcher} ordersTotal={getOrdersTotal()} isOpen={isOpen} setIsOpen={setIsOpen} />
            <UnitEnd unitState={unitState} unitType={unitType} unitDispatcher={unitDispatcher} ordersTotal={getOrdersTotal()} timeCost={getTimeCost()} setParentOpen={setOpen} isEndOpen={isEndOpen} setIsEndOpen={setIsEndOpen} unitName={unitName} />
        </Layout>
    );
}

function MarketItems({ unitState, unitDispatcher, ordersTotal, isOpen, setIsOpen }) {

    function handleClick(uid) {

        let myItem = unitState.orders.find(item => item.uid === uid);
        myItem.count++;
        unitDispatcher({type: 'ADD_ORDER', payload: myItem})

    }

    return (
        <Modal
            title={unitState.orders.length > 0 ? 'Choose From Market Items' : 'No Market Items Founded !!'}
            className='custom-modal custom-modal-footer'
            open={isOpen} onOk={() => setIsOpen(false)}
            onCancel={() => setIsOpen(false)}
            footer={[
                unitState.orders.length > 0 && <span key="total" style={{fontSize: 16, fontWeight: 'bold'}}>Orders Total: {ordersTotal}$</span>,
                <Button key='ok'  type='primary' onClick={() => setIsOpen(false)}>Ok</Button>
            ]}
            >
            {unitState.orders.length > 0 && <div className='menu-items'>
                {
                    unitState.orders.map((item, i) => <div key={i} onClick={() => handleClick(item.uid)}>
                        <img src={item.icon.local ? `/market/${item.icon.src}` : item.icon.src} width={50} height={50} alt={`market item ${i + 1}`} />
                        <span className='name'>{item.name}</span>
                        <span className='price'>{item.price}$</span>
                    </div>)
                }
            </div>}
            {
                unitState.orders.length === 0 && <div style={{height: '50vh', textAlign: 'center'}}><NoData style={{maxHeight: '100%'}} /></div>
            }
        </Modal>
    )
}

function UnitEnd({isEndOpen, unitState, setParentOpen, setIsEndOpen, unitDispatcher, unitName, ordersTotal, timeCost, unitType}) {

    const dispatch = useDispatch()
    const colors = useSelector(state => state.theme.colors) 

    let title = unitName.split('');
    title.splice(unitName.indexOf('Drawer'), 7)
    let finalTitle = title.join("").slice(0, title.indexOf(' ') + 1) + '> #' + title.join("").slice(title.indexOf(' ') + 1)
    
    const iconSize = 1
    const rowsStyle = {marginBottom: 3}
    const colsStyle = {fontSize: 16, fontWeight: 'bold'}
    const unitImgStyle = {
        fill: colors.textWithOpacity(90),
        filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, .8))',
        height: 65,
        position: 'relative',
        padding: unitType === 'ps4' ? '6px 6px 0' : ''
    }

    function handleClick() {
        setIsEndOpen(false)
        unitDispatcher({type: 'UNIT_END'})
        dispatch(setOrdersOnEndUint(unitState.orders))
        setParentOpen(false)

        let newDate = new Date();
        let day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
        let month = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
        let date = `${day}-${month}-${newDate.getFullYear()}`
        let hours = newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
        let minutes = newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : newDate.getMinutes();

        let unitPayload = {
            type: unitType,
            date,
            time: `${hours}:${minutes}`,
            value: timeCost,
            itemName: '#' + unitName.slice(-2)
        }
        dispatch({type: 'reports/addReport', payload: unitPayload})
        if (ordersTotal > 0) {
            let theRealOrders = unitState.orders
                            .filter(item => item.count > 0)
                            .map(item => ({
                                type: 'market',
                                date,
                                time: `${hours}:${minutes}`,
                                value: item.count * item.price,
                                itemName: item.name
                            }))
            
            dispatch({type: 'reports/addReport', payload: theRealOrders})
        }
        message.success('Closed Successful')
    }

    return (
        <Modal
            title='End Time'
            className='custom-modal endtime-modal'
            open={isEndOpen} onOk={() => setIsEndOpen(false)}
            onCancel={() => setIsEndOpen(false)}
            footer={[
                <Button key='ok' type='primary'   onClick={handleClick}>End Now</Button>,
                <Button key='back'   onClick={() => setIsEndOpen(false)}>Cancel</Button>
            ]}
            >
                <div className='head'>
                    <h3>{finalTitle}</h3>
                    {
                        unitType === 'pc' ? <PCSVG style={unitImgStyle} />
                        : unitType === 'ps4' ? <PS4 style={unitImgStyle} />
                        : unitType === 'ps5' ? <PS5 style={unitImgStyle} /> : null
                        
                    }
                </div>
                <Row style={{...rowsStyle, marginTop: 12, color: '#faad14'}}>
                    <Col style={colsStyle} xs={2} span={iconSize}>
                        <ShoppingCartOutlined />
                    </Col>
                    <Col style={colsStyle} xs={22} span={24 - iconSize}>
                        Orders: {ordersTotal}$
                    </Col>
                </Row>
                <Row style={{...rowsStyle, color: '#2980b9'}}>
                    <Col style={colsStyle} xs={2} span={iconSize}>
                        <FieldTimeOutlined />
                    </Col>
                    <Col style={colsStyle} xs={22} span={24 - iconSize}>
                        Time Cost: {timeCost}$
                    </Col>
                </Row>
                <Row style={{...rowsStyle, color: '#17BBB0'}}>
                    <Col style={colsStyle} xs={2} span={iconSize}>
                        <DollarCircleOutlined />
                    </Col>
                    <Col style={colsStyle} xs={22} span={24 - iconSize}>
                        Total Cost: {ordersTotal + timeCost}$
                    </Col>
                </Row>
        </Modal>
    )
}

export default DrawerContent;