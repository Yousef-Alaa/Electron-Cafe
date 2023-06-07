import React from 'react';
import { Typography, Row, Col } from 'antd';
import Shapes from '../assets/shapes.png';
import { useSelector } from 'react-redux';

let { Title } = Typography;

function PagesHead({ pageTitle }) {

    const colors = useSelector(state => state.theme.colors)

    return (
        <Row justify='space-between' align='center' style={{marginBlock: `5px 15px`}}>
            <Col style={{display: 'flex', alignItems: 'center'}}><Title style={{color: colors.text, margin: 0}}>{pageTitle}</Title></Col>
            <Col style={{display: 'flex', alignItems: 'center'}}><img width={150} style={{filter: `drop-shadow(2px 4px 5px ${colors.text})`}} src={Shapes} alt='Controls' /></Col>
        </Row>
    );
}

export default PagesHead;