import * as React from "react"
import PropTypes from "prop-types"
import hoistNonReactStatics from 'hoist-non-react-statics';

export default function (Component) {
    function WithSocket({forwardedRef, ...props}, context) {
        return <Component {...props} ref={forwardedRef} socket={context.socket}/>
    }

    WithSocket.contextTypes = {
        socket: PropTypes.any
    };

    const ForwardedWithSocket = React.forwardRef((props, ref) => <WithSocket {...props} forwardedRef={ref}/>);
    hoistNonReactStatics(ForwardedWithSocket, Component);
    return ForwardedWithSocket;
}