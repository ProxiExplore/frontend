import React, {useEffect} from 'react';
import {Button, Form, InputNumber, Row} from 'antd';
import {PlacesApi} from "../../services/PlacesApi";
import {HttpStatusCode} from "axios";

interface SearchNearPlacesProps {
    initialValues: { lat: number, lon: number, distance: number };
    setPlaces: Function;
    setDistance: Function;
    setLocation: Function;
}

const SearchNearPlaces: React.FC<SearchNearPlacesProps> = (props) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(props.initialValues);
    }, [props.initialValues]);

    const gerNearPlaces = (request: { lat: number, lon: number, distance: number }) => {
        PlacesApi.near(request)
            .then(response => {
                if (response.status === HttpStatusCode.Ok) {
                    props.setPlaces(response.data);
                }
            })
            .catch(error => console.log(error))
    }

    const onFinish = (fieldsValue: any) => {
        gerNearPlaces({lat: fieldsValue.lat, lon: fieldsValue.lon, distance: fieldsValue.distance})
    }

    const onChangeLocation = (value: any, field: string) => {
        if (!value){
            return
        }

        if (field === "lon"){
            props.setLocation({lng: value, lat: props.initialValues.lat});
        }else {
            props.setLocation({lat: value, lng: props.initialValues.lon});
        }
    }

    const onChangeDistance = (value: number | null) => {
        if (!value){
            return
        }

        props.setDistance(value);
    }

    return (
        <Row justify="space-around" align="middle">
            <Form
                layout={"inline"}
                form={form}
                initialValues={props.initialValues}
                onFinish={onFinish}
                style={{maxWidth: 'none', padding: 20, textAlign: "center", height: '100%'}}
            >
                <Form.Item name={"lat"} label="Latitude">
                    <InputNumber onChange={e => onChangeLocation(e, "lat")} style={{width: 150}} placeholder="Latitude"/>
                </Form.Item>
                <Form.Item name={"lon"} label="Longtude">
                    <InputNumber onChange={e => onChangeLocation(e, "lon")} style={{width: 150}} placeholder="Longtude"/>
                </Form.Item>
                <Form.Item name={"distance"} label="Distance">
                    <InputNumber onChange={onChangeDistance} style={{width: 100}} min={0} placeholder="distance" addonAfter="mi"/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType={"submit"} type="primary">Search Places</Button>
                </Form.Item>
            </Form>
        </Row>
    );
};

export default SearchNearPlaces;
