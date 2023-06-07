import React, { useEffect, useState } from 'react';
import { Button, Table, message, Popconfirm } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { MdOutlineEdit } from 'react-icons/md';
import PagesHead from '../../componenets/PagesHead';
import NewMarketItem from '../../componenets/NewMarketItem';
import EditMarketItem from '../../componenets/EditMarketItem';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, deleteItems } from '../../redux/marketSlice'
import { ReactComponent as NODATA } from '../../assets/no-market.svg'

const columns = [
    { title: '#ID', dataIndex: 'uid'},
    { title: 'Icon', dataIndex: 'iconAsImg' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Price', dataIndex: 'price', sorter: (a, b) => a.price - b.price},
    { title: 'Stowage', dataIndex: 'stowage', sorter: (a, b) => a.stowage - b.stowage},
    { title: 'Actions', dataIndex: 'actions' }
];


export default function Market() {

    const dispatch = useDispatch()
    const market = useSelector(state => state.market)
    
    const [localMarket, setLocalMarket] = useState([])
    const [itemId, setItemId] = useState('000000')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const rowSelection = {
    selectedRowKeys,
    onChange: newKeys => setSelectedRowKeys(newKeys),
    selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
        {
            key: 'odd',
            text: 'Select Odd Row',
            onSelect: (changableRowKeys) => {
                let newSelectedRowKeys = [];
                newSelectedRowKeys = changableRowKeys.filter((_, index) => {
                    if (index % 2 !== 0) {
                        return false;
                    }
                    return true;
                });
                setSelectedRowKeys(newSelectedRowKeys);
            },
        },
        {
            key: 'even',
            text: 'Select Even Row',
            onSelect: (changableRowKeys) => {
                let newSelectedRowKeys = [];
                newSelectedRowKeys = changableRowKeys.filter((_, index) => {
                    if (index % 2 !== 0) {
                    return true;
                    }
                    return false;
                });
                setSelectedRowKeys(newSelectedRowKeys);
            },
        },
    ],
    };

    useEffect(() => {
        let data = market.map((item, ind) => {
            let i = ind + 1;
            return {
            ...item, 
            key: i,
            iconAsImg: <img src={item.icon.local ? `/market/${item.icon.src}` : item.icon.src} width='40' height='40' alt='icon' />,
            actions: <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                columnGap: '20px'
            }}>
                <MdOutlineEdit onClick={() => {setIsEditModalOpen(true); setItemId(item.uid)}} style={{cursor: "pointer", fontSize: 18}} />
                <Popconfirm
                placement="topRight"
                title='Confirm Deleting'
                description={`Are you sure to delete Item ?`}
                onConfirm={() => {
                    dispatch(deleteItem(item.uid))
                    setItemId('000000')
                    message.success('Deleted Successfuly')
                }}
                okText="Yes"
                cancelText="No"
                icon={<QuestionCircleOutlined style={{color: 'red'}}/>}>
                    <DeleteOutlined style={{cursor: "pointer", fontSize: 18, color: '#ff4d4f'}} />
                </Popconfirm>
            </div>
        }})

        setLocalMarket(data)
    }, [market])

    function handleDeleteItems() {
        let items = localMarket.filter(item => selectedRowKeys.includes(item.key)).map(item => item.uid)
        if (items.length === 0) {
            message.error('Please Select At Least One Item')
            return;
        }
        dispatch(deleteItems(items))
        setSelectedRowKeys([])
        setItemId('000000')
        message.success('Deleted Successfuly')
    }

    return (
    <div className='market'>
        <PagesHead pageTitle='Market' />
        {
            localMarket.length > 0 ?
            <Table rowSelection={rowSelection} columns={columns} dataSource={localMarket} /> :
            <div className='no-data no-data-market'><NODATA /></div>
        }
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 20, paddingBottom: 40}}>
            <Button type='primary' onClick={() => setIsNewModalOpen(true)} style={{marginRight: 12}}>Add New Item</Button>
            {localMarket.length > 0 && <Button type='primary' onClick={handleDeleteItems} danger>Remove Selected Items</Button>}
        </div>
        
        <EditMarketItem isEditModalOpen={isEditModalOpen} setIsEditModalOpen={setIsEditModalOpen} itemId={itemId} setItemId={setItemId} />
        <NewMarketItem isNewModalOpen={isNewModalOpen} setIsNewModalOpen={setIsNewModalOpen} />
    </div>)
}
