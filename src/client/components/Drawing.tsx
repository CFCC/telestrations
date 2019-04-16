import React, {Component} from 'react';
// @ts-ignore - this library is new at the time of writing and has no types file
import {SketchField, Tools} from 'react-sketch';

class Drawing extends Component {
    render() {
        return <div>
            <SketchField width='1024px'
                         height='768px'
                         tool={Tools.Pencil}
                         lineColor='black'
                         lineWidth={3}/>
        </div>;
    }
}

export default Drawing;