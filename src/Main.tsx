import { Component } from "react";
import { ConversationDto } from "./chat";
import { LeftPane } from "./LeftPane";
import { proxy } from "./Proxy2";
import { RightPane } from "./RightPane";
import './TextInput.css'

export class Main extends Component
{
    state = { selectedConversation: undefined as ( ConversationDto | undefined ) };
    render()
    {
     let className = "main row " + ( this.state.selectedConversation ? "right" : "left" );
        console.log(className);
        return (
            
            <div className={className}>
            <LeftPane
            inbox={ proxy.inbox! }
            selectedConversation={ this.state.selectedConversation }
            onSelect={ c => this.setState( { selectedConversation: c } ) } />
            <RightPane conversation={ this.state.selectedConversation }
onBack={ () => this.setState( { selectedConversation: undefined } ) } />
            </div>
            );
        }
    }