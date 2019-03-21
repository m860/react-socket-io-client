import * as React from "react"
import io from "socket.io"
import http from "http"
import renderer from "react-test-renderer"
import SocketConnect from "../components/SocketConnect";
import SocketEvent from "../components/SocketEvent";
import {withSocket} from "../index";

jest.setTimeout(20 * 1000);

let httpServer, socketServer, url;

beforeAll((done) => {
    httpServer = http.createServer();
    const addr = httpServer.listen().address();
    url = `http://0.0.0.0:${addr.port}`;
    socketServer = io(httpServer);
    done();
});

afterAll((done) => {
    socketServer.close();
    httpServer.close();
    done();
});

test(`<SocketConnect/>`, (done) => {
    let component, tree;
    const connectCallback = jest.fn(() => {
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        const socketIns = component.getInstance().getSocketInstance();
        socketIns.disconnect();
    });
    const disconnectCallback = jest.fn(() => {
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        component.unmount();
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        done();
    });
    component = renderer.create(
        <SocketConnect url={url}
                       event={{
                           "connect": connectCallback,
                           "disconnect": disconnectCallback
                       }}>
            socket is connected
        </SocketConnect>
    );
});

test(`<SocketEvent/>`, (done) => {
    const name = "abc";
    const message = "hello";
    let component;
    const ignore = "ignore";
    const ignoreCallback = jest.fn();
    const nameCallback = jest.fn((data) => {
        expect(data).toBe(message)
        component.unmount();
        socketServer.emit("ignore", "ignore message");
        setTimeout(() => {
            expect(ignoreCallback.mock.calls.length).toBe(0);
            done();
        }, 100);
    });
    component = renderer.create(
        <SocketConnect url={url}
                       event={{
                           "connect": () => {
                               //服务器发送一个测试消息
                               socketServer.emit(name, message);
                           }
                       }}>
            <SocketEvent name={name} callback={nameCallback}/>
            <SocketEvent name={ignore} callback={ignoreCallback}/>
        </SocketConnect>
    )
});

test("withSocket", (done) => {
    const name = "hello";
    const message = "world";
    let testRef = null;
    let component = null;
    const serverCallback = jest.fn((data) => {
        expect(data).toBe(message);
        expect(typeof testRef.hello).toBe("function");
        component.unmount();
        setTimeout(() => {
            done();
        }, 100);
    });
    socketServer.on("connect", (socket) => {
        socket.on(name, serverCallback);
    });

    class Test extends React.Component {
        render() {
            return null;
        }

        hello() {
        }

        componentDidMount() {
            expect(this.props.socket).not.toBeNull();
            expect(this.props.socket).not.toBeUndefined();
            this.props.socket.emit(name, message);
        }
    }

    const SocketTest = withSocket(Test);
    component = renderer.create(
        <SocketConnect url={url}>
            <SocketTest ref={ref => testRef = ref}/>
        </SocketConnect>
    )
});
