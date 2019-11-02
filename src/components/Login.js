import React from 'react';

import {
    Form,
    Input,
    Alert,
    Checkbox,
    Button
} from 'antd';
import { relativeTimeThreshold } from 'moment';

class LoginForm extends React.Component {

    state = {
        confirmDirty: false,
        loggedInSuccessfully: false, //if the user is added successfully
        showLogin: false, //if should we show a succesful feedback message after loggin in a user
        showError: false, //if should we show an error feedback message after logging in a user
        errorCode: 400, //to save the errorCode we received from the api server
        responseStatus: "nothing", //the validation status of the email
        errorMessage: "", //the error message to display to the user after server rejects action
        usernameMessage: 'Check Username',
        passwordMessage: 'Check Password'
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //echo the values to the browswer console to make sure they are correct
                console.log('Received values of form: ', values);

                //here we should send a request to our server
                //use fetch API to post the user data

                fetch('http://localhost:3000/api/v1.0/login',{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + window.btoa(values.username + ':' + values.password),
                    },
                    body: JSON.stringify({values})
                }).then(res => {
                    if(res.ok){
                        this.setState({loggedInSuccessfully:true})
                        this.props.view()
                    }else {
                        console.log(res.status)
                        this.setState({
                            loggedInSuccessfully:false,
                            errorCode: res.status,
                            errorMessage: res.statusText 
                        });
                        this.checkResponse()
                        return res.json()
                    }
                })
            }
        })
    };

    checkResponse = () => {

        if(this.state.loggedInSuccessfully){
            //this.props.form.resetFields();
            this.setState({
                showSuccess:true,
                showError : false
            });
        } else {
            //handle errors
            this.setState({
                //errorMessage: this.state.errorCode,
                showSuccess:false,
                showError:true,
                responseStatus:"error"
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        //this code will handle form responsiveness on small devices
        const formItemLayout = {
            labelCol: {
                xs: { span: 24},
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="Username" hasFeedback validateStatus={this.state.responseStatus}>
                    {getFieldDecorator('username', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ],
                    })(<Input onChange={this.handleEmail} />)}
                </Form.Item>
                <Form.Item label="Password" hasFeedback  validateStatus={this.state.responseStatus}>
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your password',
                            },
                            {
                                min: 6,
                                message: 'password should be at least 6 characters long!',
                            },
                        ],
                    })(<Input.Password />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
                {this.state.showSuccess ? <Alert message="account created successfully" type="success" /> :null}
                {this.state.showError ? <Alert message={"Error code " + this.state.errorCode + " " + this.state.errorMessage} type="error" /> :null}
            </Form>
        );
    }
}

const Login = Form.create({ name: 'login' })(LoginForm);

export default Login;