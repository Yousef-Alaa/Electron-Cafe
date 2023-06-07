import React from "react";
import Unit from '../../componenets/Unit';
import PagesHead from "../../componenets/PagesHead";
import { Link } from 'react-router-dom'
import { ReactComponent as NODATA } from '../../assets/no-devices.svg'
import { useSelector } from "react-redux";
import { useEffect } from "react";

function Home() {

    const { pc, ps4, ps5 } = useSelector(state => state.units)

    const style = {
        paddingBottom: 15,
        display: 'grid',
        gap: 15,
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gridTemplateRows: `repeat(1, 1fr)`,
    }

    return (<>
        <PagesHead pageTitle='Home' />
        {
            pc.devices + ps4.devices + ps5.devices === 0 ? <div className='no-data'><NODATA /><span className="text">Go To <Link to='/settings'>Settings</Link> Page</span></div> : 
            <div style={style}>
                {Array(pc.devices).fill(0).map((item, ind) => <Unit key={ind} index={ind} unitType='pc' />)}
                {Array(ps4.devices).fill(0).map((item, ind) => <Unit key={ind} index={ind} unitType='ps4' />)}
                {Array(ps5.devices).fill(0).map((item, ind) => <Unit key={ind} index={ind} unitType='ps5' />)}
            </div>
        }
    </>);
}

export default Home;