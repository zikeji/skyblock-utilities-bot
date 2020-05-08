import {KlasaClient} from "klasa";

KlasaClient.defaultClientSchema
    .add("counter", folder => folder
        .add("total", "integer")
        .add("commands", "any", {array: true})
    );
