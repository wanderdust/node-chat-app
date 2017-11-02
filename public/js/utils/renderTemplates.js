let renderTemplate = ($template, message) => {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let html = Mustache.render($template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html)
  scrollToBottom();
}
