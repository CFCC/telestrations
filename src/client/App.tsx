import React, {Component} from 'react';
import {Button, TextField} from "@material-ui/core";

class App extends Component {
    state = {
        ip: ""
    };

    changeIp(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ip: e.target.value});
    }

    render() {
        return (
            <div>
                <TextField value={this.state.ip} onChange={this.changeIp}/>
                <Button/>
            </div>
        );
    }
}

export default App;
