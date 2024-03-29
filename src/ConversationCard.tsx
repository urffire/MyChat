import { Component } from "react";
import { ConversationDto, InboxDto } from "./chat";
import { proxy } from "./Proxy2";

export class ConversationCard extends Component<{
    conversation: ConversationDto,
    selected: boolean,
    onSelect: () => void
}>
{
    render()
    {
        let lastMessage = this.props.conversation.lastMessages.length > 0 ?
        this.props.conversation.lastMessages[ this.props.conversation.lastMessages.length - 1 ] : null;
        return (
            <div className={ "conversation-card" + ( this.props.selected ? " selected" : "" ) }
            onClick={ () => this.props.onSelect() }>
            <div className="row">
            <span className="channel-name">{ this.props.conversation.name }</span>
            <span className="time">
            { lastMessage && new Date( lastMessage.timeStamp ).toLocaleDateString() } 
            {/*  Z0Y2BJ  ezért Date-ben kell kiírni */}
            </span>
            </div>
            <span className="last-message">{ lastMessage?.content }</span>
            </div>
            );
        }
        componentDidMount()
        {
            proxy.addEventListener( "message", ( cid, m ) =>
            {
                if ( cid === this.props.conversation.channelId )
                this.forceUpdate();
            }, this );
        }
        componentWillUnmount()
        {
            proxy.removeAllEventListener( this );
        }
    }