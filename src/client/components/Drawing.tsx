import React, {Component} from 'react';
// @ts-ignore (there's a types file, and WebStorm sees it, but for some reason typescript does not)
import {SketchField, Tools} from 'react-sketch';

interface DrawingState {
    tool: string;
    color: string;
    width: number;
}

class Drawing extends Component<{}, DrawingState> {
    state = {
        tool: Tools.Pencil,
        color: 'black',
        width: 3
    };

    render() {
        return <div>
            <SketchField width='1024px'
                         height='768px'
                         tool={this.state.tool}
                         lineColor={this.state.color}
                         lineWidth={this.state.width}/>
        </div>;
    }
}

export default Drawing;