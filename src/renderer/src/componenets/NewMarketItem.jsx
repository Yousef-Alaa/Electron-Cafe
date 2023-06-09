import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUID } from '../App';
import { addItem } from '../redux/marketSlice'
import { Modal, Row, Col, InputNumber, Input, Select, Switch, message } from 'antd'

function NewMarketItem({ isNewModalOpen, setIsNewModalOpen }) {

    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const images = window.api.marketImages
    const [localIcon, setLocalIcon] = useState(images[0])
    const [stowage, setStowage] = useState(0)
    const [price, setPrice] = useState(0)
    const [iconURL, setIconURL] = useState('')
    const [isCustom, setCustom] = useState(false)

    function handleOk() {
        
        let newItem = {
            uid: getUID(),
            price,
            stowage,
            name,
            icon: {local: !isCustom, src: isCustom ? iconURL : localIcon}
        }

        function isImgUrl(url) {
            const img = new Image();
            img.src = url;
            return new Promise((resolve) => {
                img.onerror = () => resolve(false);
                img.onload = () => resolve(true);
            });
        }

        if (name !== '' && price !== null && stowage !== null) {
            if (isCustom) {
                isImgUrl(iconURL).then(res => {
                    if (res) {
                        dispatch(addItem(newItem))
                        setIsNewModalOpen(false);
                        setName('')
                        setLocalIcon('nescafe.png')
                        setStowage(0)
                        setPrice(0)
                        setIconURL('')
                        setCustom(false)
                        message.success('Added Successfuly')
                    } else {
                        message.error('Please Enter a Valid Image URL')
                    }
                })
            } else {
                dispatch(addItem(newItem))
                setIsNewModalOpen(false);
                setName('')
                setLocalIcon('nescafe.png')
                setStowage(0)
                setPrice(0)
                setIconURL('')
                setCustom(false)
                message.success('Added Successfuly')
            }
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

    return (
        <Modal title='Add New Item' className='custom-modal' open={isNewModalOpen} onOk={handleOk} onCancel={() => setIsNewModalOpen(false)}>
            <Row>
                <Col span={24} style={{marginBottom: 15}}>
                    <label style={{display: 'block'}}>Name</label>
                    <Input placeholder="Name" onChange={e => setName(e.target.value)} value={name} />
                </Col>
                <Col span={8}>
                    <label style={{display: 'block'}}>Icon</label> 
                    <Select
                        // defaultValue='nescafe.png'
                        value={localIcon}
                        style={{width: 75 }}
                        onChange={val => setLocalIcon(val)}
                        options={images.map(item => ({
                            value: item,
                            label:  <div style={{display: 'flex', justifyContent: 'center'}}>
                                        <img src={`market/${item}`} alt={item.split('').slice(0, item.indexOf('.')).join('')} width={30} height={30} />
                                    </div>
                        }))}
                    />
                </Col>
                <Col span={8} style={{marginBottom: 15}}>
                    <label style={{display: 'block'}}>Stowage</label>
                    <InputNumber placeholder="Count" onChange={value => setStowage(value)} value={stowage} />
                </Col>
                <Col span={8} style={{marginBottom: 15}}>
                    <label style={{display: 'block'}}>Price</label>
                    <InputNumber placeholder="Price" onChange={value => setPrice(value)} value={price} />
                </Col>
                <Col style={{display: 'flex', alignItems: 'center'}} span={24}>
                    <Input placeholder="Type Icon url" disabled={!isCustom} value={iconURL} onChange={e => setIconURL(e.target.value)} type='url' />
                    <span style={{display: 'block', whiteSpace: 'nowrap', marginLeft: 10, fontSize: 12}}>Use Custom Icon ?</span>
                    <Switch style={{marginLeft: 10}} checked={isCustom} onChange={val => setCustom(val)} />
                </Col>
            </Row>
        </Modal>
    );
}

export default NewMarketItem;