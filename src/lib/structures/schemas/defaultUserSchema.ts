import {KlasaClient} from 'klasa';

KlasaClient.defaultUserSchema
    .add('minecraft', folder => folder
        .add('uuid', 'string')
        .add('link_method', 'string')
        .add('link_datetime', 'string')
        .add('link_history', 'any', {array: true})
    );
