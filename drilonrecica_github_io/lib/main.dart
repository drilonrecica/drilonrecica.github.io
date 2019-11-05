import 'content_container.dart';
import 'responsive_layout.dart';
import 'package:flutter/material.dart';

import 'util/link_util.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Drilon Reçica',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Android Magician'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var flutterLinkTextDecoration = TextDecoration.none;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: <Widget>[
          Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Expanded(
                  flex: 1,
                  child: Image.asset(
                    "assets/images/prishtina.jpg",
                    fit: BoxFit.cover,
                  ),
                )
              ]),
          Container(
            color: Color.fromRGBO(0, 0, 0, 0.60),
          ),
          Padding(
            padding: EdgeInsets.all(64.0),
            child: Align(
              alignment: Alignment.bottomRight,
              child: MouseRegion(
                onEnter: (onHover) {
                  setState(() {
                    flutterLinkTextDecoration = TextDecoration.underline;
                  });
                },
                onExit: (onHover) {
                  setState(() {
                    flutterLinkTextDecoration = TextDecoration.none;
                  });
                },
                child: InkWell(
                  onTap: () {
                    UrlUtil.openLink("https://flutter.dev/web", "");
                  },
                  child: Text(
                    "Made with Flutter Web",
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: "Roboto",
                      fontWeight: FontWeight.bold,
                      decoration: flutterLinkTextDecoration,
                    ),
                  ),
                ),
              ),
            ),
          ),
          ResponsiveLayout(
            largeChild: ContentContainer(
              screenSize: ScreenSize.large,
            ),
            mediumChild: ContentContainer(
              screenSize: ScreenSize.medium,
            ),
            smallChild: ContentContainer(
              screenSize: ScreenSize.small,
            ),
          ),
        ],
      ),
    );
  }
}
