import * as React from "react"
import io from "socket.io-client"
import PropTypes from "prop-types"


type SocketConnectProps = {
    //socket链接的url
    url: string,
    options?: Object,
    // path?: string,
    event?: {
        [key: string]: Function
    }
};

type SocketConnectState = {
    /**
     * 是否已经连接成功
     */
    connected: boolean
};

export default class SocketConnect extends React.Component<SocketConnectProps, SocketConnectState> {
    static childContextTypes = {
        socket: PropTypes.any
    };

    _socket = null;
    _onConnect = () => {
        this.setState({
            connected: true
        });
    };
    _onDisconnect = () => {
        this.setState({
            connected: false
        });
    };
    _bindEvent = () => {
        if (this._socket) {
            this._socket.on("connect", this._onConnect);
            this._socket.on("disconnect", this._onDisconnect);
            if (this.props.event) {
                for (let key in this.props.event) {
                    this._socket.on(key, this.props.event[key]);
                }
            }
        }

    };
    _unbindEvent = () => {
        if (this._socket) {
            this._socket.off("connect", this._onConnect);
            this._socket.off("disconnect", this._onDisconnect);
            if (this.props.event) {
                for (let key in this.props.event) {
                    this._socket.off(key, this.props.event[key]);
                }
            }
        }
    };

    state = {
        connected: false
    };

    getChildContext() {
        return {
            socket: this._socket
        };
    }

    render() {
        if (this.state.connected) {
            return this.props.children;
        }
        return null;
    }

    componentDidMount() {
        this._socket = io(this.props.url, this.props.options);
        this._bindEvent();
    }

    componentWillUnmount() {
        if (this._socket) {
            this._unbindEvent();
            if (this._socket.connected) {
                this._socket.close();
            }
            this._socket.destroy();
        }
    }
}