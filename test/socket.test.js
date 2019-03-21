import * as React from "react"
import io from "socket.io"
import http from "http"
import renderer from "react-test-renderer"
import SocketConnect from "../components/SocketConnect";
import SocketEvent from "../components/SocketEvent";

jest.setTimeout(10 * 1000);

let httpServer, socketServer, httpServerAddr;

beforeAll((done) => {
    httpServer = http.createServer();
    httpServerAddr = httpServer.listen().address();
    socketServer = io(httpServer);
    done();
});

afterAll((done) => {
    socketServer.close();
    httpServer.close();
    done();
});

test(`<SocketConnect/>`, (done) => {
    const url = `http://0.0.0.0:${httpServerAddr.port}`;
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
    const url = `http://[${httpServerAddr.address}]:${httpServerAddr.port}`;
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
