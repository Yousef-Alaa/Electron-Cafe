import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { DatePicker, Select } from 'antd'
import dayjs from 'dayjs';
import PagesHead from '../../componenets/PagesHead';
import { ReactComponent as NODATA } from '../../assets/no-reports.svg'

export default function Reports() {

    const reportsList = useSelector(state => state.reports);
    const [typeFilter, setTypeFilter] = useState('all')

    const dateFormat = 'DD-MM-YYYY';
    const newDate = new Date();
    const day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
    const month = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
    const today = `${day}-${month}-${newDate.getFullYear()}`
    const [dateFilter, setDateFilter] = useState(today)

    const renderList = reportsList.filter(item => {
        if (typeFilter === 'all') return true;
        return item.type === typeFilter;
    }).filter(item => item.date === dateFilter)


    return (
    <>
        <PagesHead pageTitle='Reports' />
        <div className="reports">
            <div className='filters'>
                <div style={{marginBottom: 15, fontSize: 16}}>
                    <span style={{marginRight: 10}}>Reports Day:</span>
                    <DatePicker
                    format={dateFormat}
                    defaultValue={dayjs(dateFilter, dateFormat)}
                    onChange={(d, dateString) => setDateFilter(dateString)} />
                </div>
                <div style={{marginBottom: 15, fontSize: 16}}>
                    <span style={{marginRight: 10}}>Filter By Type:</span>
                    <Select 
                        size='small'
                        value={typeFilter} 
                        onChange={value => setTypeFilter(value)} 
                        options={[
                            {value: 'all', label: 'Show All'},
                            {value: 'pc', label: 'PC'},
                            {value: 'ps4', label: 'PS4'},
                            {value: 'ps5', label: 'PS5'},
                            {value: 'market', label: 'Market'}
                        ]} />
                </div>
            </div>
            {
                renderList.length === 0 ? <div className='no-data no-data-reports'><NODATA /></div> :(<>
                    <div className='head'>
                        <span>type</span>
                        <span>item</span>
                        <span>value</span>
                        <span>time</span>
                        <span>date</span>
                    </div>
                    {
                    renderList.map((item, i) => <div key={i}>
                        <span>{item.type === 'market' ? item.type : item.type.toUpperCase()}</span>
                        <span>{item.itemName}</span>
                        <span>{item.value}$</span>
                        <span>{item.time}</span>
                        <span>{item.date}</span>
                    </div>)
                    }
                <span style={{padding: '12px 10px', fontSize: 'clamp(17px, 2.2vw, 24px)', display: 'block', fontWeight: "bold"}}>Total: {renderList.reduce((x, y) => x + y.value, 0).toFixed(2)}$</span>
                </>)
            }
        </div>
    </>)
}