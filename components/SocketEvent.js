import * as React from "react"
import PropTypes from "prop-types"

type SocketEventProps = {
    name: string,
    callback: Function
};

export default class SocketEvent extends React.PureComponent<SocketEventProps> {
    static contextTypes = {
        socket: PropTypes.any
    };

    render() {
        return null;
    }

    componentDidMount() {
        if (this.context.socket) {
            this.context.socket.on(this.props.name, this.props.callback);
        }
    }

    componentWillUnmount() {
        if (this.context.socket) {
            this.context.socket.off(this.props.name, this.props.callback);
        }
    }
}