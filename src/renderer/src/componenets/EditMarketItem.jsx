import { Modal, Row, Col, InputNumber, Input, message } from 'antd'
import { useEffect, useState } from 'react';
import { editItem } from '../redux/marketSlice'
import { useDispatch, useSelector } from 'react-redux';

function EditMarketItem({isEditModalOpen, setIsEditModalOpen, itemId, setItemId}) {

    const dispatch = useDispatch()
    const market = useSelector(state => state.market)

    const myItem = itemId === '000000' ? {name: '', stowage: 0, price: 0} : market.filter(item => item.uid === itemId)[0]
    
    const [name, setName] = useState(myItem.name)
    const [stowage, setStowage] = useState(myItem.stowage)
    const [price, setPrice] = useState(myItem.price)

    function handleOk() {
        let item = {
            uid: itemId,
            price,
            stowage,
            name,
            icon: myItem.icon
        }

        if (name !== '' && price !== null && stowage !== null) {
            dispatch(editItem(item))
            setItemId('000000')
            message.success('Changed Successfuly')
        } else {
            if (name === '') {
                message.error('Name Is Required')
            } else if (stowage === null) {
                message.error('Stowage Is Required')
            } else if (price === null) {
                message.error('Price Is Required')
            }
        }
    };

    useEffect(() => {
        setName(myItem.name)
        setPrice(myItem.price)
        setStowage(myItem.stowage)
    }, [myItem])

    return itemId === '000000' ? <div style={{display: 'none'}}>Select One</div> : (
        <Modal title={`Editing item #${itemId}`} className='custom-modal' open={isEditModalOpen} onOk={handleOk} onCancel={() => {setIsEditModalOpen(false); setItemId('000000')}}>
            <Row>
                <Col span={24} style={{textAlign: 'right'}}>
                <img src={myItem.icon.local ? `market/${myItem.icon.src}` : myItem.icon.src} width='40' height='40' alt='icon' />
                </Col>
                <Col span={24} style={{marginBottom: 15}}>
                    <label style={{display: 'block'}}>Name</label>
                    <Input placeholder="Name" onChange={e => setName(e.target.value)} value={name} />
                </Col>
                <Col span={12} style={{marginBottom: 15}}>
                    <label style={{display: 'block'}}>Stowage Count</label>
                    <InputNumber placeholder="Count" onChange={value => setStowage(value)} value={stowage} />
                </Col>
                <Col span={12} style={{marginBottom: 15}}>
                    <label style={{display: 'block'}}>Price</label>
                    <InputNumber placeholder="Price" onChange={value => setPrice(value)} value={price} />
                </Col>
            </Row>
        </Modal>
    );
}

export default EditMarketItem;