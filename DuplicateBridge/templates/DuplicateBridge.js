{% include "TeamsPage.js" %}

var _newTeam = function( name1, name2 ) {
    return {
        p1: name1,
        p2: name2,
        string: function() {
            return this.p1 + " & " + this.p2;
        },
        valid: function() {
            return this.p1.length > 0 && this.p2.length > 0;
        }
    }
};

var bridgeConfig = {
    teams : new Map(),
    teamIs : function( id, name1, name2 ) {
        this.teams.set( id, _newTeam( name1, name2 ) );
    },
    teamDel : function( id ) {
        this.teams.delete( id );
    }
}

var appSm = {
    page : 'teams',

    pageIs : function( page ) {
        if( page === this.page ) {
            return;
        }
        var curpage = appDom.pages[ this.page ];
        var nextpage = appDom.pages[ page ];
        this.page = page;
        curpage.hide();
        nextpage.show();
        console.log( 'Page: ' + page );

        appDom.activateBreadcrumb( page );
    },

    onBreadcrumbClicked : function( e ) {
        e = $( e );
        appDom.popBreadcrumbsTo( e.data( 'page' ) );
        this.pageIs( e.data( 'page' ) );
    }
}

var appDom = {
    pages : {
        teams : $( "#teams-page" ),
        play : $( "#play-page" )
    },
    pageNames : {
        teams : 'Teams',
        play : 'Play'
    },

    breadcrumb : $( ".breadcrumb" ),

    pushBreadcrumb : function( page ) {
        var name = this.pageNames[ page ];
        this.breadcrumb.append(
                $( $.parseHTML( '<li data-page="' + page + '"  \
                                onclick="appSm.onBreadcrumbClicked(this)" >'
                                + name + '</li>' ) ) );
        this.activateBreadcrumb( page );
    },

    activateBreadcrumb : function( page ) {
        var breadcrumbs = this.breadcrumb.children();
        for( var i = 0; i < breadcrumbs.length; i++ ) {
            var child = $( breadcrumbs[ i ] )
            var childPage = child.data( 'page' )
            if( childPage === page ) {
                child.addClass( 'active' );
                child.text( this.pageNames[ childPage ] );
            } else {
                child.removeClass( 'active' );
                child.html( '<a href="#">' + this.pageNames[ childPage ] + '</a>' );
            }
        }
    },

    popBreadcrumbsTo : function( page ) {
        var breadcrumbs = this.breadcrumb.children();
        for( var i = breadcrumbs.length - 1; i > 0; i-- ) {
            var child = $( breadcrumbs[ i ] )
            if( child.data( 'page' ) == page ) {
                break;
            } else {
                child.remove();
            }
        }
        this.activateBreadcrumb( page );
    },
}

function main() {
   appDom.pushBreadcrumb( 'teams' );
   teamsPage.teamIs();
}

main();
