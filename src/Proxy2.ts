
import { OutgoingPacket, InboxDto, IncomingPacket,MessageDto } from './chat'
import './TextInput.css'

export class EventProducer<M> {
  private listeners: { type: keyof M, listener: M[keyof M], obj?: Object }[] = [];

  addEventListener<K extends keyof M>(type: K, listener: M[K], obj?: Object) {
    this.listeners.push({ type, listener, obj });
  }

  removeEventListener<K extends keyof M>(type: K, listener: M[K], obj?: Object) {
    this.listeners.splice(this.listeners.findIndex(x => x.type === type && x.listener === listener), 1);
  }

  protected dispatch(type: keyof M, ...args: any[]) {
    for (let listener of this.listeners.filter(x => x.type === type)) {
      (listener.listener as unknown as Function).call(listener.obj, ...args);
    }
  }

  removeAllEventListener(obj?: Object) {
    if (!obj) {
      throw new Error("Must specify object");
    }
    this.listeners = this.listeners.filter(x => x.obj !== obj);
  }
}

interface ProxyEventMap
{
"login": () => void;
"message": ( channelId: string, message: MessageDto ) => void;
"conversation": ( channelId: string ) => void;
}


class Proxy extends EventProducer<ProxyEventMap>
{
  private ws: WebSocket;
  inbox: InboxDto | null = null;
  constructor()
  {
      super();
    this.ws = new WebSocket( "wss://raja.aut.bme.hu/chat/" );
    this.ws.addEventListener( "open", () =>
{

} );
    this.ws.addEventListener( "message", e =>
    {
      console.log(e.data);
      try {
        let p = JSON.parse(e.data) as IncomingPacket;
        
        switch ( p.type )
        {
          case "error":
          alert( p.message );
          break;
          case "login":
            this.inbox = p.inbox;
            this.dispatch( "login" );
            break;
          case "message":
            let cid = p.channelId;
            this.inbox!.conversations.find( x => x.channelId === cid )?.lastMessages.push( p.message );
            this.dispatch( "message", cid, p.message );
            break;
          case "conversationAdded":
            this.inbox!.conversations.push( p.conversation );
            this.dispatch( "conversation", p.conversation.channelId );
            break;
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.log("ERROR");
      }
    } );
    this.ws.addEventListener( "open", () =>
      {

        
        
      } );
  }
  sendPacket(packet: OutgoingPacket) {
    this.ws.send(JSON.stringify(packet));
  }

}


export var proxy = new Proxy();



