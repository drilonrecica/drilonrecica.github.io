import 'package:flutter/foundation.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:universal_html/prefer_universal/html.dart' as html;

class UrlUtil {
  static void launchURL(String url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }

  static void openLink(String url, String name) {
    if (kIsWeb) {
      html.window.open(url, name);
    } else {
      launchURL(url);
    }
  }
}
