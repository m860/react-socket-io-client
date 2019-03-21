# react-socket-io-client

Socket.IO client component for React and React Native

[![npm version](https://img.shields.io/npm/v/react-socket-io-client.svg)](https://www.npmjs.com/package/react-socket-io-client)
[![npm license](https://img.shields.io/npm/l/react-socket-io-client.svg)](https://www.npmjs.com/package/react-socket-io-client)
[![npm download](https://img.shields.io/npm/dm/react-socket-io-client.svg)](https://www.npmjs.com/package/react-socket-io-client)
[![npm download](https://img.shields.io/npm/dt/react-socket-io-client.svg)](https://www.npmjs.com/package/react-socket-io-client)
[![Build Status](https://travis-ci.org/m860/react-socket-io-client.svg?branch=master)](https://travis-ci.org/m860/react-socket-io-client)
[![Coverage Status](https://coveralls.io/repos/github/m860/react-socket-io-client/badge.svg?branch=master)](https://coveralls.io/github/m860/react-socket-io-client?branch=master)

## Install

```
$ npm i react-socket-io-client --save
```

## Simple Usage

```
import * as React from "react"
import {SocketConnect,SocketEvent} from "react-socket-io-client"

class Example extends React.Component{
    render(){
        return (
            <SocketConnect url={"YOUR SOCKET URL"}>
                <ScoketEvent name={"YOUR EVENT"} callback={()=>null}></ScoketEvent>
            </SocketConnect>
        );
    }
}
```

<!--begin react doc markdown-->
## Table Content

- [SocketConnect](#socketconnect)
- [SocketEvent](#socketevent)

# SocketConnect




## props

- `url` **string** 
- `options?` **Object** 
- `event?` **signature** 

## methods

- `getSocketInstance` **()=>void** 获取socket实例


# SocketEvent




## props

- `name` **string** 
- `callback` **Function** 



<!--end react doc markdown-->

### withSocket

如果要在组件内通过`props.socket`访问socket实例可以使用`withSocket`来实现.前提是组件必须是`<SocketConnect>`的子组件,

```
import {withSocket} from "react-socket-io-client"

@withSocket
class Test extends React.Component{
    ...
}
```