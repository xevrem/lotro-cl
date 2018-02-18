import React, { Component } from 'react';

const List = props => {
    let list_items = props.children.map((item, i) =>{
        return(
            <li key={i} className={props.list_item_class}>
                {item}
            </li>
        );
    });
    return (
        <ul className={props.list_class}>
            {list_items}
        </ul>
    );
}

export default List;